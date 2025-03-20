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

class LinksProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->singleton('fof-links.override', function () {
            return false;
        });
    }
}
