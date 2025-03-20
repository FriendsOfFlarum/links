<?php

namespace FoF\Links;

use FoF\Links\Concerns\HasLinkAttributes;

class LinkDefinition
{
    use HasLinkAttributes;

    /** @var int|null */
    public ?int $id = null;

    /** @var string */
    public string $translationKey;

    /** @var string */
    public string $url;

    /** @var string */
    public string $icon;

    /** @var bool */
    public bool $isInternal;

    /** @var bool */
    public bool $isNewtab;

    /** @var bool */
    public bool $useRelme;

    /** @var bool */
    public bool $guestOnly;

    /** @var int|null */
    public ?int $parentId;

    public ?int $position = null;

    /** @var LinkDefinition[] */
    public array $children = [];

    /**
     * Constructor.
     */
    public function __construct()
    {
        $defaults = self::getDefaultAttributes();

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
     * Factory method.
     *
     * @return self
     */
    public static function make(): self
    {
        return new self();
    }

    public function withId(int $id): self
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

    public function withPosition(int $position): self
    {
        $this->position = $position;
        return $this;
    }

    /**
     * Add a child link.
     *
     * @param LinkDefinition $child
     * @return self
     */
    public function addChild(LinkDefinition $child): self
    {
        $child->parentId = $this->id;
        $this->children[] = $child;
        return $this;
    }

    public function getChildren(): array
    {
        return $this->children;
    }
}
