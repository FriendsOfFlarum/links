<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;

class LinkSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'links';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($link)
    {
        $attributes = [
            'id'         => $link->id,
            'title'      => $link->title,
            'url'        => $link->url,
            'position'   => $link->position,
            'isInternal' => $link->is_internal,
            'isNewtab'   => $link->is_newtab,
        ];

        return $attributes;
    }
}
