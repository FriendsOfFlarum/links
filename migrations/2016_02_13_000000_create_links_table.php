<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('links')) {
            return;
        }

        $schema->create('links', function (Blueprint $table) use ($schema) {
            $table->increments('id');

            $table->string('title', 50);
            $table->string('type', 30);
            $table->string('url', 255);
            $table->integer('ref_id')->unsigned()->nullable();
            $table->integer('position')->nullable();

            Migration::fixIndexNames($schema, $table);
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('links');
    },
];
