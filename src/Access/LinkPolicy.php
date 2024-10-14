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

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use FoF\Links\Link;

class LinkPolicy extends AbstractPolicy
{
    public function view(User $actor, Link $link)
    {
        if ($link->parent_id !== null && !$actor->can('view', $link->parent)) {
            return $this->deny();
        }

        if ($link->is_restricted) {
            $id = $link->id;

            return $actor->hasPermission("link$id.view");
        }
    }
}
