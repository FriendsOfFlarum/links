<?php

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
