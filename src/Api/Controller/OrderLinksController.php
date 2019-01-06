<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2018 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Api\Controller;

use Flarum\User\AssertPermissionTrait;
use Flarum\Http\Controller\ControllerInterface;
use FoF\Links\Link;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\EmptyResponse;

class OrderLinksController implements ControllerInterface
{
    use AssertPermissionTrait;

    /**
     * {@inheritdoc}
     */
    public function handle(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $order = array_get($request->getParsedBody(), 'order');

        foreach ($order as $i => $link) {
            Link::where('id', $link['id'])->update(['position' => $i]);
        }

        return new EmptyResponse(204);
    }
}
