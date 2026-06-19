<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => static function (Builder $schema) {
        $connection = $schema->getConnection();

        if ($schema->hasColumn('links', 'registered_users_only')) {
            $connection->table('links')
                ->where('registered_users_only', true)
                ->update(['visibility' => 'members']);

            $schema->table('links', function (Blueprint $table) {
                $table->dropIndex(['registered_users_only']);
                $table->dropColumn('registered_users_only');
            });
        }
    },
    'down' => function (Builder $schema) {
        // Nothing
    },
];
