<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Command;

use Flarum\User\User;

class EditLink
{
    /**
     * @param int   $linkId The ID of the link to edit.
     */
    public function __construct(public $linkId, public User $actor, public array $data)
    {
    }
}
