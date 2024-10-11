<?php

use Flarum\Database\Migration;

return Migration::addColumns('links', [
    'guest_only' => ['boolean', 'default' => 0],
]);
