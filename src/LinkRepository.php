<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2018 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class LinkRepository
{
    /**
     * Find a link by ID
     *
     * @param int $id
     * @param User $actor
     * @return Link
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($id, User $actor = null)
    {
        return Link::where('id', $id)->firstOrFail();
    }

    /**
     * Get all links
     *
     * @param User|null $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return Link::newQuery();
    }
}
