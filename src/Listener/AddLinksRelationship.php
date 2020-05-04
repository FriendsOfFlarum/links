<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Listener;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Event\WillSerializeData;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Links\Api\Serializer\LinkSerializer;
use FoF\Links\Link;
use Illuminate\Contracts\Events\Dispatcher;

class AddLinksRelationship
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetApiRelationship::class, [$this, 'GetApiRelationship']);
        $events->listen(WillSerializeData::class, [$this, 'WillSerializeData']);
        $events->listen(WillGetData::class, [$this, 'includeLinksRelationship']);
    }

    /**
     * @param WillSerializeData $event
     */
    public function GetApiRelationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(ForumSerializer::class, 'links')) {
            return $event->serializer->hasMany($event->model, LinkSerializer::class, 'links');
        }
    }

    /**
     * @param WillSerializeData $event
     */
    public function WillSerializeData(WillSerializeData $event)
    {
        if ($event->isController(ShowForumController::class)) {
            $event->data['links'] = Link::all();
        }
    }

    /**
     * @param WillGetData $event
     */
    public function includeLinksRelationship(WillGetData $event)
    {
        if ($event->isController(ShowForumController::class)) {
            $event->addInclude(['links', 'links.parent']);
        }
    }
}
