<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Provider;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Links\LinkRepository;
use Illuminate\Contracts\Container\Container;

class LinksProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->singleton('fof-links.override-links', fn () => []);

        $this->container->bind(
            'fof-links.override',
            fn (Container $container) => $container->make(LinkRepository::class)->hasOverrideLinks()
        );
    }
}
