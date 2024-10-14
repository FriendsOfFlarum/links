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
use Flarum\Foundation\Config;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class LoadForumLinksRelationship
{
    /**
     * @var Config
     */
    protected $config;

    /**
     * @var LinkRepository
     */
    protected $links;

    public function __construct(Config $config, LinkRepository $links)
    {
        $this->config = $config;
        $this->links = $links;
    }

    /**
     * @param ShowForumController    $controller
     * @param                        $data
     * @param ServerRequestInterface $request
     */
    public function __invoke(ShowForumController $controller, &$data, ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);

        // So that admins don't have to see guest only items but can manage them in admin panel,
        // we only serialize all links if we're visiting the admin panel
        if ($actor->isAdmin() && $this->isAdminPath($request)) {
            return $data['links'] = Link::all();
        }

        $links = $this->links->getLinks($actor);

        if (!$actor->isGuest()) {
            // If the user is not a guest, and link that has the valued `guests_only` = true should be removed.
            $links = $links->reject(function ($link) {
                return $link->guest_only;
            });
        }

        $data['links'] = $links;
    }

    private function isAdminPath(ServerRequestInterface $request): bool
    {
        $adminPath = Arr::get($this->config, 'paths.admin');

        return Arr::get($request->getServerParams(), 'REQUEST_URI') === "/$adminPath";
    }
}
