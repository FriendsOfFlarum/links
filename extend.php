<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use FoF\Links\Api\Controller;
use FoF\Links\Api\Serializer\LinkSerializer;
use FoF\Links\Event\PermissionChanged;

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
        ->delete('/links/{id}', 'links.delete', Controller\DeleteLinkController::class)
        ->remove('permission')
        ->post('/permission', 'permission', Controller\SetPermissionController::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->hasMany('links', LinkSerializer::class),

    (new Extend\Event())
        ->listen(PermissionChanged::class, Listener\LinkPermissionChanged::class),

    (new Extend\ApiController(ShowForumController::class))
        ->addInclude(['links', 'links.parent'])
        ->prepareDataForSerialization(LoadForumLinksRelationship::class),

    (new Extend\Settings())
        ->registerLessConfigVar('fof-links-show-only-icons-on-mobile', 'fof-links.show_icons_only_on_mobile', function ($value) {
            return $value ? 'true' : 'false';
        }),

    (new Extend\ModelVisibility(Link::class))
        ->scope(Access\ScopeLinkVisibility::class),

    (new Extend\Policy())
        ->modelPolicy(Link::class, Access\LinkPolicy::class),
];
