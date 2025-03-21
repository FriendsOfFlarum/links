<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use FoF\Links\Command\DeleteLink;
use FoF\Links\Concerns\ChecksOverride;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeleteLinkController extends AbstractDeleteController
{
    use ChecksOverride;

    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * {@inheritdoc}
     */
    protected function delete(ServerRequestInterface $request)
    {
        if ($this->linksAreOverridden()) {
            $this->notValid();
        }

        $this->bus->dispatch(
            new DeleteLink(Arr::get($request->getQueryParams(), 'id'), RequestUtil::getActor($request))
        );
    }
}
