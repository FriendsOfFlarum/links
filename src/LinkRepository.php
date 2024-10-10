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

use Flarum\User\User;
use Illuminate\Contracts\Cache\Store as Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class LinkRepository
{
    protected static $cacheKeyPrefix = 'fof-links.links.';
    protected static $cacheGuestLinksKey = 'guest';

    /**
     * @var Cache
     */
    protected $cache;

    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Get a new query builder for the links table.
     *
     * @return Builder
     */
    public function query()
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
     * @param int  $id
     * @param User $actor
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     *
     * @return Link
     */
    public function findOrFail($id, User $actor = null)
    {
        $query = Link::where('id', $id);

        return $this->scopeVisibleTo($query, $actor)->firstOrFail();
    }

    /**
     * Get all links, optionally making sure they are visible to a
     * certain user.
     *
     * @param User|null $user
     *
     * @return \Illuminate\Database\Eloquent\Collection<Link>
     */
    public function all(User $user = null)
    {
        $query = Link::query();

        return $this->scopeVisibleTo($query, $user)->get();
    }

    /**
     * Scope a query to only include records that are visible to a user.
     *
     * @param Builder<Link> $query
     * @param User|null     $user
     *
     * @return Builder<Link>
     */
    protected function scopeVisibleTo(Builder $query, ?User $user = null)
    {
        if ($user !== null) {
            $query->whereVisibleTo($user);
        }

        return $query;
    }

    /**
     * Gets the cache key for the appropriate links for the given user. Only applicable for guests.
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
     * Get the links for the given user.
     *
     * @param User $actor
     *
     * @return Collection
     */
    public function getLinks(User $actor): Collection
    {
        return $this->getLinksFromDatabase($actor);
        //return $actor->isGuest() ? $this->getGuestLinks($actor) : $this->getLinksFromDatabase($actor);
    }

    /**
     * Get the links for guests.
     *
     * If the links are cached, they will be returned from the cache, else the cache will be populated from the database.
     *
     * @param User $actor
     *
     * @return Collection
     */
    public function getGuestLinks(User $actor): Collection
    {
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
     * @return Collection
     */
    protected function getLinksFromDatabase(User $actor): Collection
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
}
