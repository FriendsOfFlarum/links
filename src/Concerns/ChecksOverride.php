<?php

namespace FoF\Links\Concerns;

use Flarum\Foundation\ValidationException;

trait ChecksOverride
{
    public function linksAreOverridden(): bool
    {
        return resolve('fof-links.override');
    }

    public function notValid()
    {
        throw new ValidationException([
            'links' => 'Links are overridden',
        ]);
    }
}
