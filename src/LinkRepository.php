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
use Illuminate\Database\Eloquent\Collection;

class LinkRepository
{
    protected static $cacheKeyPrefix = 'fof-links.links.';
    protected static $cacheGuestLinksKey = 'guest';
    protected static $cacheMemberLinksKey = 'member';

    /**
     * @var Cache
     */
    protected $cache;

    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
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
        return Link::where('id', $id)->firstOrFail();
    }

    /**
     * Get all links.
     */
    public function all()
    {
        return Link::query()->get();
    }

    /**
     * Gets the cache key for the appropriate links for the given user.
     *
     * @param User $actor
     *
     * @return string
     */
    public function cacheKey(User $actor): string
    {
        return self::$cacheKeyPrefix.($actor->isGuest() ? self::$cacheGuestLinksKey : self::$cacheMemberLinksKey);
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
        return $actor->isGuest() ? $this->getGuestLinks($actor) : $this->getMemberLinks($actor);
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
            $links = $this->getGuestLinksFromDatabase();
            $this->cache->put($this->cacheKey($actor), $links, 60);

            return $links;
        }
    }

    /**
     * Get the links for guests from the database.
     *
     * @return Collection
     */
    protected function getGuestLinksFromDatabase(): Collection
    {
        return Link::query()
            ->where('visibility', 'guests')
            ->orWhere('visibility', 'everyone')
            ->get();
    }

    /**
     * Get the links for members.
     *
     * If the links are cached, they will be returned from the cache, else the cache will be populated from the database.
     *
     * @param User $actor
     *
     * @return Collection
     */
    public function getMemberLinks(User $actor): Collection
    {
        if ($links = $this->cache->get($this->cacheKey($actor))) {
            return $links;
        } else {
            $links = $this->getMemberLinksFromDatabase($actor);
            $this->cache->put($this->cacheKey($actor), $links, 60);

            return $links;
        }
    }

    /**
     * Get the links for members from the database.
     *
     * @param User $actor
     *
     * @return Collection
     */
    protected function getMemberLinksFromDatabase(User $actor): Collection
    {
        return Link::query()
            ->where('visibility', 'members')
            ->orWhere('visibility', 'everyone')
            ->get();
    }

    /**
     * Clear the links cache.
     */
    public function clearLinksCache(): void
    {
        $this->cache->forget(self::$cacheKeyPrefix.self::$cacheGuestLinksKey);
        $this->cache->forget(self::$cacheKeyPrefix.self::$cacheMemberLinksKey);
    }
}
