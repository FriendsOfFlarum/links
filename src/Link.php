<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links;

use Flarum\Database\AbstractModel;

/**
 * @property int    $id
 * @property string $title
 * @property string $icon
 * @property string $url
 * @property int    $position
 * @property bool   $is_internal
 * @property bool   $is_newtab
 * @property bool   $use_relme
 * @property bool   $registered_users_only
 * @property int    $parent_id
 * @property Link   $parent
 * @property string $visibility
 */
class Link extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'links';

    /**
     * @var array
     */
    protected $casts = [
        'is_internal'           => 'boolean',
        'is_newtab'             => 'boolean',
    ];

    /**
     * Create a new link.
     *
     * @param string $name
     * @param string $icon
     * @param string $url
     * @param bool   $isInternal
     * @param bool   $isNewtab
     *
     * @return static
     */
    public static function build($name, $icon, $url, $isInternal, $isNewtab, $visibility, $useRelMe = false)
    {
        $link = new static();

        $link->title = $name;
        $link->icon = $icon;
        $link->url = $url;
        $link->is_internal = (bool) $isInternal;
        $link->is_newtab = (bool) $isNewtab;
        $link->use_relme = (bool) $useRelMe;
        $link->visibility = $visibility;

        return $link;
    }

    public function parent()
    {
        return $this->belongsTo(self::class);
    }

    public function save(array $options = []): bool
    {
        $result = parent::save($options);

        resolve(LinkRepository::class)->clearLinksCache();

        return $result;
    }

    public function delete()
    {
        $result = parent::delete();

        resolve(LinkRepository::class)->clearLinksCache();

        return $result;
    }
}
