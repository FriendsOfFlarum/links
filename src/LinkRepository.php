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
    protected static string $cacheKeyPrefix = 'fof-links.links.';
    protected static string $cacheGuestLinksKey = 'guest';

    /**
     * Optional programmatic override links.
     *
     * @var LinkDefinition[]|null
     */
    protected $overrideLinks = null;

    public function __construct(protected Cache $cache, protected Translator $translator)
    {
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
     *
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
     * @param Link                  $parentLink
     * @param array<LinkDefinition> $childDefinitions
     *
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

        if ($actor->isGuest()) {
            return $this->getGuestLinks($actor);
        }

        $links = $this->getLinksFromDatabase($actor)
            ->reject(fn (Link $link) => $link->guest_only)
            ->values();

        return $this->wireParents($links);
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

        $cached = $this->cache->get($this->cacheKey($actor));

        // The cache holds plain attribute arrays, not serialized models:
        // models silently break when the schema or the class changes between
        // write and read, while attribute arrays rehydrate through the model
        // exactly like a fresh query. Anything else (including the serialized
        // collections older versions stored) is treated as a miss and
        // replaced.
        if (is_array($cached)) {
            $links = Link::hydrate($cached);
        } else {
            $links = $this->getLinksFromDatabase($actor);
            $this->cache->forever(
                $this->cacheKey($actor),
                $links->map(fn (Link $link) => $link->getAttributes())->all()
            );
        }

        return $this->wireParents($links);
    }

    /**
     * Point each link's parent relation at the model already in the set.
     *
     * The visible set contains every visible parent, so serializing the
     * links.parent include must reuse those models — otherwise each parent
     * is fetched again by id, with the whole visibility subquery attached.
     *
     * @param EloquentCollection<int, Link> $links
     *
     * @return EloquentCollection<int, Link>
     */
    protected function wireParents(EloquentCollection $links): EloquentCollection
    {
        $byId = $links->keyBy('id');

        foreach ($links as $link) {
            // Set the relation on every link — null for roots. A link with no
            // loaded parent relation triggers the relationship buffer, and
            // the buffer reloads the relation for ALL buffered links at once,
            // undoing this wiring and costing the refetch query anyway.
            //
            // A parent that is not in the visible set resolves to null too:
            // the set contains every link the actor may see, so anything
            // missing from it must not be serialized for them either.
            $link->setRelation('parent', $link->parent_id !== null ? $byId->get($link->parent_id) : null);
        }

        return $links;
    }

    /**
     * Get the links for guests from the database.
     *
     * @param User $actor
     *
     * @return EloquentCollection<int, Link>
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
