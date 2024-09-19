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

class LinkPolicy
{
    public function see(User $actor, Link $link)
    {
    }
}
