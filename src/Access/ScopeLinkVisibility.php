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
use Illuminate\Database\Eloquent\Builder;

class ScopeLinkVisibility
{
    /**
     * @param User    $actor
     * @param Builder $query
     */
    public function __invoke(User $actor, Builder $query)
    {
        $query->where('visibility', 'everyone');

        if ($actor->isGuest()) {
            $query
                ->orWhere('visibility', 'guests');
        } else {
            $query
                ->orWhere('visibility', 'members');
        }
    }
}
