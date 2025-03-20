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

class OverrideLinks
{
    public function __invoke(): array
    {
        return [
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('fof-links.links.discussion')
                ->withUrl('https://flarum.org')
                ->withIcon('fas fa-link')
                ->withIsInternal(false)
                ->withIsNewtab(true)
                ->withUseRelme(false)
                ->withGuestOnly(false),
            LinkDefinition::make()
                ->withId(2)
                ->withTranslationKey('fof-links.links.discussion2')
                ->withUrl('https://flarum2.org')
                ->withIcon('fas fa-link')
                ->withIsInternal(false)
                ->withIsNewtab(true)
                ->withUseRelme(false)
                ->withGuestOnly(false),
            LinkDefinition::make()
                ->withId(3)
                ->withTranslationKey('fof-links.override.dropdown')
                ->withIcon('fas fa-exclamation-circle')
                ->addChild(
                    LinkDefinition::make()
                    ->withId(4)
                    ->withTranslationKey('fof-links.override.link1')
                    ->withUrl('https://duckduckgo.com')
                    ->withIcon('fas fa-search')
                    ->withIsNewtab(true)
                    ->withPosition(1)
                )
                ->addChild(
                    LinkDefinition::make()
                        ->withId(5)
                        ->withTranslationKey('fof-links.override.link2')
                        ->withUrl('/settings')
                        ->withIsInternal(true)
                        ->withIcon('fas fa-user')
                        ->withPosition(2)
                ),
            LinkDefinition::make()
                ->withId(99)
                ->withTranslationKey('fof-links.override.test.insiders')
                ->addChild(
                    LinkDefinition::make()
                        ->withId(10)
                        ->withTranslationKey('fof-links.override.area51')
                        ->withUrl('/t/area-51')
                        ->withIsInternal(true)
                        ->withPosition(1)
                )
                ->addChild(
                    LinkDefinition::make()
                        ->withId(11)
                        ->withTranslationKey('fof-links.override.insider_tag')
                        ->withUrl('/t/insiders')
                        ->withIsInternal(true)
                        ->withPosition(2)
                ),
        ];
    }
}
