<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\SChema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('links', function (Blueprint $table) {
            $table->unsignedInteger('parent_id')->nullable();

            $table->foreign('parent_id')->references('id')->on('links')->onDelete('set null');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('links', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);

            $table->dropColumn('parent_id');
        });
    }
];
