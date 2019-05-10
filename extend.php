<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Extend;
use FoF\Links\Api\Controller;
use FoF\Links\Listener;
use Illuminate\Contracts\Events\Dispatcher;

return [
    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    (new Extend\Routes('api'))
        ->post('/links', 'links.create', Controller\CreateLinkController::class)
        ->post('/links/order', 'links.order', Controller\OrderLinksController::class)
        ->patch('/links/{id}', 'links.update', Controller\UpdateLinkController::class)
        ->delete('/links/{id}', 'links.delete', Controller\DeleteLinkController::class),

    function (Dispatcher $events) {
        $events->subscribe(Listener\AddLinksRelationship::class);
    },
];
