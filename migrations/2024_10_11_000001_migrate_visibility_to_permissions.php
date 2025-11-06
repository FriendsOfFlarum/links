<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Carbon\Carbon;
use Flarum\Group\Group;
use Flarum\Group\Permission;
use FoF\Links\Link;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        // Fetch all links using the ORM
        $links = Link::all();

        foreach ($links as $link) {
            $permissionName = "link{$link->id}.view";
            $createdAt = Carbon::now();

            switch ($link->visibility) {
                case 'everyone':
                    // Everyone can see it - add permission for guests (which includes members)
                    Permission::create([
                        'group_id'   => Group::GUEST_ID,
                        'permission' => $permissionName,
                        'created_at' => $createdAt,
                    ]);

                    $link->is_restricted = false;
                    $link->save();
                    break;

                case 'members':
                    // Only members can see it
                    Permission::create([
                        'group_id'   => Group::MEMBER_ID,
                        'permission' => $permissionName,
                        'created_at' => $createdAt,
                    ]);

                    $link->is_restricted = true;
                    $link->save();
                    break;

                case 'guests':
                    // Only guests can see it
                    Permission::create([
                        'group_id'   => Group::GUEST_ID,
                        'permission' => $permissionName,
                        'created_at' => $createdAt,
                    ]);

                    $link->is_restricted = false;
                    $link->guest_only = true;
                    $link->save();
                    break;
            }
        }
    },

    'down' => function (Builder $schema) {
        // Fetch all links using the ORM
        $links = Link::all();

        foreach ($links as $link) {
            $permissionName = "link{$link->id}.view";

            // Remove permissions using ORM
            Permission::where('permission', $permissionName)->delete();

            // Reverse the changes to is_restricted and guest_only
            $link->is_restricted = false;
            $link->guest_only = false;
            $link->save();
        }
    },
];
