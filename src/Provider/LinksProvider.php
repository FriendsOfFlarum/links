<?php

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