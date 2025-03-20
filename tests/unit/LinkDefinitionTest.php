<?php

namespace FoF\Links\Tests\unit;

use FoF\Links\LinkDefinition;
use PHPUnit\Framework\TestCase;

class LinkDefinitionTest extends TestCase
{
    public function test_link_definition_creation()
    {
        $link = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('test.key')
            ->withUrl('/test')
            ->withIcon('fas fa-test')
            ->withIsInternal(true)
            ->withIsNewtab(false)
            ->withUseRelme(false)
            ->withGuestOnly(false)
            ->withPosition(0);

        $this->assertEquals(1, $link->id);
        $this->assertEquals('test.key', $link->translationKey);
        $this->assertEquals('/test', $link->url);
        $this->assertEquals('fas fa-test', $link->icon);
        $this->assertTrue($link->isInternal);
        $this->assertFalse($link->isNewtab);
        $this->assertFalse($link->useRelme);
        $this->assertFalse($link->guestOnly);
        $this->assertEquals(0, $link->position);
        $this->assertEmpty($link->getChildren());
    }

    public function test_link_definition_with_children()
    {
        $parent = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('parent.key')
            ->withUrl('/parent');

        $child1 = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('child1.key')
            ->withUrl('/child1');

        $child2 = LinkDefinition::make()
            ->withId(3)
            ->withTranslationKey('child2.key')
            ->withUrl('/child2');

        $parent->addChild($child1);
        $parent->addChild($child2);

        $this->assertCount(2, $parent->getChildren());
        $this->assertEquals(1, $child1->parentId);
        $this->assertEquals(1, $child2->parentId);
    }

    public function test_nested_children()
    {
        $parent = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('parent.key')
            ->withUrl('/parent');

        $child = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('child.key')
            ->withUrl('/child');

        $grandchild = LinkDefinition::make()
            ->withId(3)
            ->withTranslationKey('grandchild.key')
            ->withUrl('/grandchild');

        $parent->addChild($child);
        $child->addChild($grandchild);

        $this->assertCount(1, $parent->getChildren());
        $this->assertCount(1, $child->getChildren());
        $this->assertEquals(1, $child->parentId);
        $this->assertEquals(2, $grandchild->parentId);
    }
}
