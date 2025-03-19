<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Extend;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use FoF\Links\LinkDefinition;
use FoF\Links\LinkRepository;
use Illuminate\Contracts\Container\Container;

class LinksOverride implements ExtenderInterface
{
    /**
     * @var LinkDefinition[]
     */
    protected array $links = [];

    /**
     * Add multiple links.
     *
     * @param LinkDefinition[] $links
     *
     * @return $this
     */
    public function addLinks(array $links)
    {
        $this->links = $links;

        return $this;
    }

    /**
     * Add a single link.
     *
     * @param LinkDefinition $link
     *
     * @return $this
     */
    public function addLink(LinkDefinition $link)
    {
        $this->links[] = $link;

        return $this;
    }

    /**
     * Extend the container.
     *
     * This binds the override links into the LinkRepository.
     *
     * @param Container      $container
     * @param Extension|null $extension
     */
    public function extend(Container $container, Extension $extension = null)
    {
        $container->resolving(LinkRepository::class, function (LinkRepository $repository) {
            $repository->setOverrideLinks($this->links);
        });
    }
}
