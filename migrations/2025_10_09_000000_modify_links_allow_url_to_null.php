<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('links', function (Blueprint $table) {
            // Ensure the 'url' column is nullable
            $table->string('url')->nullable()->change();
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('links', function (Blueprint $table) {
            // Revert the 'url' column to be non-nullable
            $table->string('url')->nullable(false)->change();
        });
    },
];
