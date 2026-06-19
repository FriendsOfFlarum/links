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
        if ($schema->hasColumn('links', 'visibility')) {
            return;
        }

        $schema->table('links', function (Blueprint $table) {
            $table->enum('visibility', ['everyone', 'members', 'guests'])->default('everyone');
            $table->index('visibility');
        });
    },

    'down' => static function (Builder $schema) {
        $indices = $schema->getIndexListing('links');

        // A previous version of down migrations hardcoded the index name, which broke this when a prefix was in use.
        // The ideal behavior is to let Laravel determine the index name, so we check in case the old hardcoded name exists.
        $hasHardcodedIndex = in_array('links_visibility_index', $indices, true);

        $schema->table('links', function (Blueprint $table) use ($hasHardcodedIndex) {
            $table->dropIndex($hasHardcodedIndex ? 'links_visibility_index' : ['visibility']);
            $table->dropColumn('visibility');
        });
    },
];
