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
     * @var LinkDefinition[]|string
     *
     * This can either be an array of LinkDefinition objects or an invokable class string that returns such an array.
     */
    protected array|string $links = [];

    /**
     * Set override links.
     *
     * Accepts either an array of LinkDefinition objects or a class string (invokable)
     * that will return an array of LinkDefinition objects.
     *
     * @param LinkDefinition[]|string $links
     *
     * @return $this
     */
    public function addLinks(array|string $links): self
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
    public function addLink(LinkDefinition $link): self
    {
        if (is_array($this->links)) {
            $this->links[] = $link;
        } else {
            // If a class string was already provided, override it with an array.
            $this->links = [$link];
        }

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
    public function extend(Container $container, ?Extension $extension = null): void
    {
        // Determine the override links array.
        if (is_string($this->links)) {
            // Resolve the invokable class via the container.
            $linksProvider = $container->make($this->links);
            $links = $linksProvider();
        } else {
            $links = $this->links;
        }

        $container->resolving(LinkRepository::class, function (LinkRepository $repository) use ($links) {
            $repository->setOverrideLinks($links);
        });
    }
}
