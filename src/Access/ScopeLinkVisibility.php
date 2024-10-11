<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Access;

use Flarum\User\User;
use FoF\Links\Link;
use Illuminate\Database\Eloquent\Builder;

class ScopeLinkVisibility
{
    /**
     * @param User    $actor
     * @param Builder $query
     */
    public function __invoke(User $actor, Builder $query)
    {
        $query->whereIn('id', function ($query) use ($actor) {
            Link::query()
                ->setQuery($query->from('links'))
                    ->whereHasPermission($actor, 'view')
                    ->select('links.id');
        });
    }
}
