<?php

use Flarum\Database\Migration;

return Migration::addColumns('links', [
    'is_restricted' => ['boolean', 'default' => 0],
]);
