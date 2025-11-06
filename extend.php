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

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Schema;
use Flarum\Extend;
use Flarum\Foundation\Config;
use FoF\Links\Api\Controller;
use FoF\Links\Event\PermissionChanged;
use Illuminate\Support\Arr;

return [
    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    // Custom permission endpoint (keep this as-is since it's custom logic)
    (new Extend\Routes('api'))
        ->remove('permission')
        ->post('/permission', 'permission', Controller\SetPermissionController::class)
        ->post('/links/order', 'links.order', Controller\OrderLinksController::class),

    // Add links relationship and attributes to forum resource
    (new Extend\ApiResource(ForumResource::class))
        ->fields(fn () => [
            Schema\Str::make('links.set')
                ->get(function ($forum, Context $context) {
                    return resolve('fof-links.override') ?: null;
                })
                ->nullable(),
            
            // Add links as a relationship that returns Link models
            Schema\Relationship\ToMany::make('links')
                ->type('links')
                ->includable()
                ->get(function ($forum, Context $context) {
                    $actor = $context->getActor();
                    $config = resolve(Config::class);
                    $linkRepository = resolve(LinkRepository::class);

                    // Check if we're in admin panel
                    $isAdminPath = false;
                    $adminPath = Arr::get($config, 'paths.admin');
                    $requestUri = Arr::get($context->request->getServerParams(), 'REQUEST_URI');

                    if ($requestUri === "/$adminPath") {
                        $isAdminPath = true;
                    }

                    // Admins in admin panel see all links
                    if ($actor->isAdmin() && $isAdminPath) {
                        return Link::all()->all();
                    }

                    // Use LinkRepository to get links (handles overrides)
                    /** @var \Illuminate\Database\Eloquent\Collection<int, Link> $links */
                    $links = $linkRepository->getLinks($actor);

                    // Filter out guest-only links for logged-in users
                    if (!$actor->isGuest()) {
                        $links = $links->reject(fn(Link $link) => $link->guest_only);
                    }

                    // Return array of model instances
                    return $links->all();
                }),
        ])
        ->endpoint('show', function (Endpoint\Show $endpoint) {
            // Use addDefaultInclude to append to existing includes, not replace them
            return $endpoint
                ->addDefaultInclude(['links', 'links.parent']);
        }),

    (new Extend\Event())
        ->listen(PermissionChanged::class, Listener\LinkPermissionChanged::class),

    (new Extend\Settings())
        ->registerLessConfigVar('fof-links-show-only-icons-on-mobile', 'fof-links.show_icons_only_on_mobile', function ($value) {
            return $value ? 'true' : 'false';
        }),

    (new Extend\ModelVisibility(Link::class))
        ->scope(Access\ScopeLinkVisibility::class),

    (new Extend\Policy())
        ->modelPolicy(Link::class, Access\LinkPolicy::class)
        ->globalPolicy(Access\GlobalPolicy::class),

    (new Extend\ServiceProvider())
        ->register(Provider\LinksProvider::class),
        
    new Extend\ApiResource(Api\Resource\LinkResource::class),
];
