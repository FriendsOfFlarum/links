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

class DeleteLink
{
    /**
     * @param int $linkId The ID of the link to delete.
     *                    is unused by default, but may be used by extensions.
     */
    public function __construct(public $linkId, public User $actor, public array $data = [])
    {
    }
}
