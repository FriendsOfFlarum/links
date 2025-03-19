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

use FoF\Links\Concerns\HasLinkAttributes;

class LinkDefinition
{
    use HasLinkAttributes;

    /**
     * Optional ID for the link.
     */
    public ?int $id;

    /**
     * The translation key for the link title.
     *
     * @var string
     */
    public string $translationKey;

    public string $url;
    public string $icon;
    public bool $isInternal;
    public bool $isNewtab;
    public bool $useRelme;
    public bool $guestOnly;
    public ?int $parentId;

    /**
     * Constructor.
     *
     * @param int|null    $id
     * @param string      $translationKey The translation key for the title.
     * @param string|null $url
     * @param string|null $icon
     * @param bool|null   $isInternal
     * @param bool|null   $isNewtab
     * @param bool|null   $useRelme
     * @param bool|null   $guestOnly
     * @param int|null    $parentId
     */
    public function __construct(
        ?int $id,
        string $translationKey,
        ?string $url = null,
        ?string $icon = null,
        ?bool $isInternal = null,
        ?bool $isNewtab = null,
        ?bool $useRelme = null,
        ?bool $guestOnly = null,
        ?int $parentId = null
    ) {
        $defaults = self::getDefaultAttributes();
        $this->id = $id;
        $this->translationKey = $translationKey;
        $this->url = $url ?? $defaults['url'];
        $this->icon = $icon ?? $defaults['icon'];
        $this->isInternal = $isInternal ?? $defaults['is_internal'];
        $this->isNewtab = $isNewtab ?? $defaults['is_newtab'];
        $this->useRelme = $useRelme ?? $defaults['use_relme'];
        $this->guestOnly = $guestOnly ?? $defaults['guest_only'];
        $this->parentId = $parentId ?? $defaults['parent_id'];
    }
}
