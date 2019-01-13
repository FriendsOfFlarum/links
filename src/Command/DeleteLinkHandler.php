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

class DeleteLinkHandler
{
    use AssertPermissionTrait;

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

        $this->assertAdmin($actor);

        $link->delete();

        return $link;
    }
}
