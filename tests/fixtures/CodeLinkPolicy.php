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

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class CodeLinkPolicy extends AbstractPolicy
{
    public const GRANTED = 'fof-links-test.policyGranted';
    public const DENIED = 'fof-links-test.policyDenied';

    public function can(User $actor, string $ability): ?string
    {
        return match ($ability) {
            self::GRANTED => $this->allow(),
            self::DENIED  => $this->deny(),
            default       => null,
        };
    }
}
