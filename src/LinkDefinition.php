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

    public ?int $id;
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
     * Initializes properties using default values from the HasLinkAttributes trait.
     */
    public function __construct()
    {
        $defaults = self::getDefaultAttributes();

        $this->id = null;
        $this->translationKey = '';
        $this->url = $defaults['url'];
        $this->icon = $defaults['icon'];
        $this->isInternal = $defaults['is_internal'];
        $this->isNewtab = $defaults['is_newtab'];
        $this->useRelme = $defaults['use_relme'];
        $this->guestOnly = $defaults['guest_only'];
        $this->parentId = $defaults['parent_id'];
    }

    /**
     * Factory method for convenience.
     *
     * @return self
     */
    public static function make(): self
    {
        return new self();
    }

    public function withId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function withTranslationKey(string $translationKey): self
    {
        $this->translationKey = $translationKey;

        return $this;
    }

    public function withUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function withIcon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function withIsInternal(bool $isInternal): self
    {
        $this->isInternal = $isInternal;

        return $this;
    }

    public function withIsNewtab(bool $isNewtab): self
    {
        $this->isNewtab = $isNewtab;

        return $this;
    }

    public function withUseRelme(bool $useRelme): self
    {
        $this->useRelme = $useRelme;

        return $this;
    }

    public function withGuestOnly(bool $guestOnly): self
    {
        $this->guestOnly = $guestOnly;

        return $this;
    }

    public function withParentId(?int $parentId): self
    {
        $this->parentId = $parentId;

        return $this;
    }
}
