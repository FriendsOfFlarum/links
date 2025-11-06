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
    'up' => function (Builder $schema) {
        // Only drop the column if it exists
        if ($schema->hasColumn('links', 'visibility')) {
            // Try to drop the index first (SQLite requirement)
            // We wrap this in try-catch because the index might not exist in test environments
            try {
                $schema->table('links', function (Blueprint $table) {
                    // Drop using column name array, same way it was created
                    $table->dropIndex(['visibility']);
                });
            } catch (\Exception) {
                // Index doesn't exist, continue
            }

            $schema->table('links', function (Blueprint $table) {
                // Then drop the column
                $table->dropColumn('visibility');
            });
        }
    },

    'down' => function (Builder $schema) {
        // Only add the column back if it doesn't exist
        if (!$schema->hasColumn('links', 'visibility')) {
            $schema->table('links', function (Blueprint $table) {
                $table->enum('visibility', ['everyone', 'members', 'guests'])->default('everyone');
                $table->index('visibility', 'links_visibility_index');
            });
        }
    },
];
