<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Relationship;

class LinkSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'links';

    /**
     * @param \FoF\Links\Link $link
     */
    protected function getDefaultAttributes($link)
    {
        $attributes = [
            'id'                  => $link->id,
            'title'               => $link->title,
            'icon'                => $link->icon,
            'url'                 => $link->url,
            'position'            => $link->position,
            'isInternal'          => $link->is_internal,
            'isNewtab'            => $link->is_newtab,
            'useRelMe'            => $link->use_relme,
            'isChild'             => (bool) $link->parent_id,
        ];

        if ($this->actor->isAdmin()) {
            $attributes['isRestricted'] = (bool) $link->is_restricted;
            $attributes['guestOnly'] = (bool) $link->guest_only;
        }


        return $attributes;
    }

    /**
     * Define the parent relationship.
     *
     * This ensures overridden links also include their parent in the API response.
     *
     * @param Link $link
     * @return Relationship
     */
    protected function parent($link)
    {
        if ($link->parent_id !== null) {
            return $this->hasOne($link, self::class);
        }

        return null;
    }
}
