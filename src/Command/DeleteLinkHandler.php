<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Command;

use FoF\Links\LinkRepository;

class DeleteLinkHandler
{
    /**
     * @var LinkRepository
     */
    protected $links;

    /**
     * @param LinkRepository $links
     */
    public function __construct(LinkRepository $links)
    {
        $this->links = $links;
    }

    /**
     * @param DeleteLink $command
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     *
     * @return \FoF\Links\Link
     */
    public function handle(DeleteLink $command)
    {
        $actor = $command->actor;

        $link = $this->links->findOrFail($command->linkId, $actor);

        $actor->assertAdmin();

        $link->delete();

        return $link;
    }
}
