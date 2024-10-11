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
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $connection = $schema->getConnection();

        // Fetch all links and map the `visibility` column to permissions.
        $links = $connection->table('links')->get();

        // Look over each row, and check the `visibility` column. Map the following values and create entries on the `group_permission` table:
        // `X` is a placeholder for the link ID.
        // - `everyone` -> ['group_id' = Group::GUEST_ID, 'permission' = 'linkX.view', 'createdAt' = Carbon::now()]
        // - `members` -> ['group_id' = Group::MEMBER_ID, 'permission' = 'linkX.view', 'createdAt' = Carbon::now()]
        // - `guests` -> ['group_id' = Group::GUEST_ID, 'permission' = 'linkX.view', 'createdAt' = Carbon::now()]

        foreach ($links as $link) {
            $permission = 'link'.$link->id.'.view';
            $createdAt = Carbon::now();

            switch ($link->visibility) {
                case 'everyone':
                    $connection->table('group_permission')->insert([
                        ['group_id' => Group::GUEST_ID, 'permission' => $permission, 'created_at' => $createdAt],
                    ]);
                    $connection->table('links')->where('id', $link->id)->update([
                        'is_restricted' => false,
                    ]);
                    break;

                case 'members':
                    $connection->table('group_permission')->insert([
                        ['group_id' => Group::MEMBER_ID, 'permission' => $permission, 'created_at' => $createdAt],
                    ]);
                    // Also add to the link row the `is_restricted` = true.
                    $connection->table('links')->where('id', $link->id)->update([
                        'is_restricted' => true,
                    ]);
                    break;

                case 'guests':
                    $connection->table('group_permission')->insert([
                        ['group_id' => Group::GUEST_ID, 'permission' => $permission, 'created_at' => $createdAt],
                    ]);
                    // Also add to the link row the `is_restricted` = true and `guest_only` = true.
                    $connection->table('links')->where('id', $link->id)->update([
                        'is_restricted' => false,
                        'guest_only'    => true,
                    ]);
                    break;
            }
        }
    },

    'down' => function (Builder $schema) {
        $connection = $schema->getConnection();

        // Remove all entries from `group_permission` that were added in the `up` function.
        $links = $connection->table('links')->get();

        foreach ($links as $link) {
            $permission = 'link'.$link->id.'.view';

            $connection->table('group_permission')->where('permission', $permission)->delete();

            // Reverse the changes to `is_restricted` and `guest_only`.
            $connection->table('links')->where('id', $link->id)->update([
                'is_restricted' => false,
                'guest_only'    => false,
            ]);
        }
    },
];
