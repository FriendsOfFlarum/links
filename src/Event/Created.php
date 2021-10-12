<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Event;

use Flarum\User\User;
use FoF\Links\Link;

class Created
{
    /**
     * @var Link
     */
    public $link;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param Link $link
     * @param User $actor
     */
    public function __construct(Link $link, User $actor)
    {
        $this->link = $link;
        $this->actor = $actor;
    }
}
