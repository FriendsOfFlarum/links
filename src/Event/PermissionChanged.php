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

class PermissionChanged
{
    /**
     * @var string
     */
    public $permission;

    /**
     * @var user
     */
    public $actor;

    public $data;

    public function __construct(string $permission, User $actor, $data)
    {
        $this->permission = $permission;
        $this->actor = $actor;
        $this->data = $data;
    }
}
