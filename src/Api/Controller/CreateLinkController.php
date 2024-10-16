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

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use FoF\Links\Api\Serializer\LinkSerializer;
use FoF\Links\Command\CreateLink;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateLinkController extends AbstractCreateController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = LinkSerializer::class;

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
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $data = Arr::get($request->getParsedBody(), 'data');

        if (!$data) {
            throw new ValidationException([
                'data' => 'Invalid payload',
            ]);
        }

        return $this->bus->dispatch(
            new CreateLink($actor, $data)
        );
    }
}
