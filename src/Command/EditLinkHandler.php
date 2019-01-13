<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Command;

use Flarum\User\AssertPermissionTrait;
use FoF\Links\LinkRepository;
use FoF\Links\LinkValidator;

class EditLinkHandler
{
    use AssertPermissionTrait;

    /**
     * @var LinkRepository
     */
    protected $links;

    /**
     * @var LinkValidator
     */
    protected $validator;

    /**
     * @param LinkRepository $links
     * @param LinkValidator  $validator
     */
    public function __construct(LinkRepository $links, LinkValidator $validator)
    {
        $this->links = $links;
        $this->validator = $validator;
    }

    /**
     * @param EditLink $command
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     *
     * @return \FoF\Links\Link
     */
    public function handle(EditLink $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $link = $this->links->findOrFail($command->linkId, $actor);

        $this->assertAdmin($actor);

        $attributes = array_get($data, 'attributes', []);

        if (isset($attributes['title'])) {
            $link->title = $attributes['title'];
        }

        if (isset($attributes['url'])) {
            $link->url = $attributes['url'];
        }

        if (isset($attributes['isInternal'])) {
            $link->is_internal = $attributes['isInternal'];
        }

        if (isset($attributes['isNewtab'])) {
            $link->is_newtab = $attributes['isNewtab'];
        }

        $this->validator->assertValid($link->getDirty());

        $link->save();

        return $link;
    }
}
