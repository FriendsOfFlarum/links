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
     * This can either be an array of LinkDefinition objects or
     * an invokable class string that returns such an array.
     */
    protected $links = [];

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
    public function addLinks($links): self
    {
        if (!is_array($this->links)) {
            // If $this->links is not already an array, just assign it.
            $this->links = $links;
        } else {
            // If $this->links is already an array and $links is an array, merge them.
            if (is_array($links)) {
                $this->links = array_merge($this->links, $links);
            } else {
                // Otherwise, if $links is not an array (i.e. it's a string) we override.
                $this->links = $links;
            }
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

        if (!empty($links)) {
            $container->resolving(LinkRepository::class, function (LinkRepository $repository) use ($links) {
                $repository->setOverrideLinks($links);
            });
            $container->extend('fof-links.override', function () {
                return true;
            });
        }
    }
}
