<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Tests\fixtures;

trait LinkUsersTrait
{
    public function authorizedUsers(): array
    {
        return [
            [1],
        ];
    }

    public function unauthorizedUsers(): array
    {
        return [
            [null],
            [2],
        ];
    }
}
