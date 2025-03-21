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

trait HasLinkAttributes
{
    /**
     * Returns a centralized definition of link attributes.
     *
     * @return array
     */
    public static function getDefaultAttributes(): array
    {
        return [
            'title'       => '',
            'url'         => '',
            'icon'        => '',
            'is_internal' => false,
            'is_newtab'   => false,
            'use_relme'   => false,
            'guest_only'  => false,
            'parent_id'   => null,
        ];
    }
}
