<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Listener;

use Flarum\Group\Group;
use FoF\Links\Event\PermissionChanged;
use FoF\Links\Link;
use Illuminate\Support\Arr;

class LinkPermissionChanged
{
    public function handle(PermissionChanged $event)
    {
        $permission = $event->permission;
        $groupIds = Arr::get($event->data, 'groupIds');

        // Example permission name: `link1.view`
        if (preg_match('/^link(\d+)\.view$/', $permission, $matches)) {
            $linkId = $matches[1];
            $link = Link::findOrFail($linkId);

            if ($this->isGuestPermission($groupIds)) {
                $link->is_restricted = false;
            } else {
                $link->is_restricted = true;
            }

            if ($link->isDirty('is_restricted')) {
                $link->save();
            }
        }
    }

    protected function isGuestPermission(array $groups): bool
    {
        // If the array contains the value of the guest group ID, then the permission is for guests.
        return in_array(Group::GUEST_ID, $groups);
    }
}
