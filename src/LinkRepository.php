<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links;

use Flarum\Locale\Translator;
use Flarum\User\User;
use Illuminate\Contracts\Cache\Store as Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class LinkRepository
{
    protected static $cacheKeyPrefix = 'fof-links.links.';
    protected static $cacheGuestLinksKey = 'guest';

    /**
     * @var Cache
     */
    protected $cache;

    /**
     * @var Translator
     */
    protected $translator;

    /**
     * Optional programmatic override links.
     *
     * @var LinkDefinition[]|null
     */
    protected $overrideLinks = null;

    public function __construct(Cache $cache, Translator $translator)
    {
        $this->cache = $cache;
        $this->translator = $translator;
    }

    /**
     * Get a new query builder for the links table.
     *
     * @return Builder
     */
    public function query(): Builder
    {
        return Link::query();
    }

    public function queryVisibleTo(?User $actor = null): Builder
    {
        return $this->scopeVisibleTo($this->query(), $actor);
    }

    /**
     * Find a link by ID.
     *
     * @param int       $id
     * @param User|null $actor
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     *
     * @return Link
     */
    public function findOrFail($id, ?User $actor = null): Link
    {
        $query = Link::where('id', $id);
        /** @var Link $link */
        $link = $this->scopeVisibleTo($query, $actor)->firstOrFail();

        return $link;
    }

    /**
     * Get all links, optionally making sure they are visible to a certain user.
     *
     * @param User|null $user
     *
     * @return EloquentCollection<Link>
     */
    public function all(?User $user = null): EloquentCollection
    {
        $query = Link::query();
        /** @var EloquentCollection<Link> $links */
        $links = $this->scopeVisibleTo($query, $user)->get();

        return $links;
    }

    /**
     * Scope a query to only include records that are visible to a user.
     *
     * @param Builder   $query
     * @param User|null $user
     *
     * @return Builder
     */
    protected function scopeVisibleTo(Builder $query, ?User $user = null): Builder
    {
        if ($user !== null) {
            $query->whereVisibleTo($user);
        }

        return $query;
    }

    /**
     * Gets the cache key for the appropriate links for the given user.
     *
     * Only applicable for guests.
     *
     * @param User $actor
     *
     * @return string
     */
    public function cacheKey(User $actor): string
    {
        if ($actor->isGuest()) {
            return self::$cacheKeyPrefix.self::$cacheGuestLinksKey;
        } else {
            throw new \InvalidArgumentException('Only guests can have cached links at this time.');
        }
    }

    /**
     * Convert an array of LinkDefinition objects to Link models, preserving hierarchy.
     *
     * @param array<LinkDefinition> $definitions
     * @return array<Link>
     */
    protected function getFlattenedLinks(array $definitions): array
    {
        $links = [];

        foreach ($definitions as $definition) {
            $link = $this->buildLinkFromDefinition($definition);
            $links[] = $link;
            
            if (!empty($definition->getChildren())) {
                $childLinks = $this->processChildDefinitions($link, $definition->getChildren());
                $links = array_merge($links, $childLinks);
            }
        }

        return $links;
    }
    
    /**
     * Process child definitions and convert them to Link models.
     *
     * @param Link $parentLink
     * @param array<LinkDefinition> $childDefinitions
     * @return array<Link>
     */
    protected function processChildDefinitions(Link $parentLink, array $childDefinitions): array
    {
        $childLinks = [];
        
        foreach ($childDefinitions as $index => $childDefinition) {
            $childLink = $this->buildLinkFromDefinition($childDefinition);
            $childLink->parent_id = $parentLink->id;
            $childLink->position = $index;
            $childLink->setRelation('parent', $parentLink);
            $childLinks[] = $childLink;
            
            if (!empty($childDefinition->getChildren())) {
                $nestedLinks = $this->processChildDefinitions($childLink, $childDefinition->getChildren());
                $childLinks = array_merge($childLinks, $nestedLinks);
            }
        }
        
        return $childLinks;
    }

    public function getLinks(User $actor): EloquentCollection
    {
        if ($this->overrideLinks !== null) {
            $links = collect($this->getFlattenedLinks($this->overrideLinks));

            if (!$actor->isGuest()) {
                $links = $links->reject(fn (Link $link) => $link->guest_only);
            }

            return new EloquentCollection($links->all());
        }

        return $this->getLinksFromDatabase($actor);
    }

    /**
     * Get the links for guests.
     *
     * If the links are cached, they will be returned from the cache, else the cache will be populated from the database.
     *
     * @param User $actor
     *
     * @return EloquentCollection<Link>
     */
    public function getGuestLinks(User $actor): EloquentCollection
    {
        if ($this->overrideLinks !== null) {
            return new EloquentCollection($this->getFlattenedLinks($this->overrideLinks));
        }

        if ($links = $this->cache->get($this->cacheKey($actor))) {
            return $links;
        } else {
            $links = $this->getLinksFromDatabase($actor);
            $this->cache->forever($this->cacheKey($actor), $links);

            return $links;
        }
    }

    /**
     * Get the links for guests from the database.
     *
     * @param User $actor
     *
     * @return EloquentCollection<Link>
     */
    protected function getLinksFromDatabase(User $actor): EloquentCollection
    {
        return Link::query()
            ->whereVisibleTo($actor)
            ->get();
    }

    /**
     * Clear the links cache.
     */
    public function clearLinksCache(): void
    {
        $this->cache->forget(self::$cacheKeyPrefix.self::$cacheGuestLinksKey);
    }

    /**
     * Set the programmatic override links.
     *
     * @param LinkDefinition[] $links
     */
    public function setOverrideLinks(array $links): void
    {
        $this->overrideLinks = $links;
    }

    /**
     * Build a Link model instance from a LinkDefinition.
     *
     * @param LinkDefinition $definition
     *
     * @return Link
     */
    protected function buildLinkFromDefinition(LinkDefinition $definition): Link
    {
        $attributes = [
            'title'       => $this->translator->trans($definition->translationKey),
            'url'         => $definition->url,
            'icon'        => $definition->icon,
            'is_internal' => $definition->isInternal,
            'is_newtab'   => $definition->isNewtab,
            'use_relme'   => $definition->useRelme,
            'guest_only'  => $definition->guestOnly,
            'parent_id'   => $definition->parentId,
            'position'    => $definition->position,
        ];

        if ($definition->id !== null) {
            $attributes['id'] = $definition->id;
        }

        $link = new Link();
        $link->setRawAttributes($attributes, true);
        if ($definition->id !== null) {
            $link->setAttribute('id', $definition->id);
        }

        $link->exists = true;
        $link->syncOriginal();
        $link->makeVisible('id');

        // Child links are handled in getFlattenedLinks

        return $link;
    }

}
