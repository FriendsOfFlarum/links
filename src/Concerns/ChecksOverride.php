<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
