<?php

use Flarum\Database\Migration;

return Migration::addColumns('links', [
    'use_relme' => ['boolean', 'default' => false],
]);
