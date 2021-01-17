<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2019 - 2021 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links;

use Flarum\Api\Controller\ShowForumController;
use Psr\Http\Message\ServerRequestInterface;

class LoadForumLinksRelationship
{
    /**
     * @param ShowForumController $controller
     * @param $data
     * @param ServerRequestInterface $request
     */
    public function __invoke(ShowForumController $controller, &$data, ServerRequestInterface $request)
    {
        /** @var \Flarum\User\User */
        $actor = $request->getattribute('actor');

        $data['links'] = $actor->isGuest() ? Link::where('registered_users_only', false)->get() : Link::all();
    }
}
