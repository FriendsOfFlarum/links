<?php

namespace FoF\Links\Tests\unit;

use Flarum\Locale\Translator;
use Flarum\User\User;
use FoF\Links\Link;
use FoF\Links\LinkDefinition;
use FoF\Links\LinkRepository;
use Illuminate\Cache\ArrayStore;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use PHPUnit\Framework\TestCase;

class LinkRepositoryTest extends TestCase
{
    protected $cache;
    protected $translator;
    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cache = $this->createMock(Store::class);
        $this->translator = $this->createMock(Translator::class);
        
        // Setup translator mock to return the translation key as is
        $this->translator->method('trans')->willReturnCallback(function($key) {
            return $key;
        });
        
        $this->repository = new LinkRepository($this->cache, $this->translator);
    }

    public function test_build_link_from_definition()
    {
        $definition = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('test.link')
            ->withUrl('/test')
            ->withIcon('fas fa-test')
            ->withIsInternal(true)
            ->withIsNewtab(false)
            ->withUseRelme(false)
            ->withGuestOnly(false)
            ->withPosition(0);

        // Use reflection to access protected method
        $method = new \ReflectionMethod(LinkRepository::class, 'buildLinkFromDefinition');
        $method->setAccessible(true);
        
        $link = $method->invoke($this->repository, $definition);
        
        $this->assertInstanceOf(Link::class, $link);
        $this->assertEquals(1, $link->id);
        $this->assertEquals('test.link', $link->title);
        $this->assertEquals('/test', $link->url);
        $this->assertEquals('fas fa-test', $link->icon);
        $this->assertTrue($link->is_internal);
        $this->assertFalse($link->is_newtab);
        $this->assertFalse($link->use_relme);
        $this->assertFalse($link->guest_only);
        $this->assertEquals(0, $link->position);
    }

    public function test_get_flattened_links()
    {
        $parent = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('parent.link')
            ->withUrl('/parent');

        $child1 = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('child1.link')
            ->withUrl('/child1');

        $child2 = LinkDefinition::make()
            ->withId(3)
            ->withTranslationKey('child2.link')
            ->withUrl('/child2');

        $parent->addChild($child1);
        $parent->addChild($child2);

        // Use reflection to access protected method
        $method = new \ReflectionMethod(LinkRepository::class, 'getFlattenedLinks');
        $method->setAccessible(true);
        
        $links = $method->invoke($this->repository, [$parent]);
        
        $this->assertCount(3, $links);
        $this->assertEquals(1, $links[0]->id);
        $this->assertEquals(2, $links[1]->id);
        $this->assertEquals(3, $links[2]->id);
        
        // Check parent-child relationships
        $this->assertEquals(1, $links[1]->parent_id);
        $this->assertEquals(1, $links[2]->parent_id);
        $this->assertInstanceOf(Link::class, $links[1]->parent);
        $this->assertEquals(1, $links[1]->parent->id);
    }

    public function test_nested_hierarchy()
    {
        $parent = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('parent.link')
            ->withUrl('/parent');

        $child = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('child.link')
            ->withUrl('/child');

        $grandchild = LinkDefinition::make()
            ->withId(3)
            ->withTranslationKey('grandchild.link')
            ->withUrl('/grandchild');

        $child->addChild($grandchild);
        $parent->addChild($child);

        // Use reflection to access protected method
        $method = new \ReflectionMethod(LinkRepository::class, 'flattenLinks');
        $method->setAccessible(true);
        
        // Create a parent link first
        $buildMethod = new \ReflectionMethod(LinkRepository::class, 'buildLinkFromDefinition');
        $buildMethod->setAccessible(true);
        $parentLink = $buildMethod->invoke($this->repository, $parent);
        
        $links = $method->invoke($this->repository, $parentLink, $parent->getChildren());
        
        $this->assertCount(3, $links);
        $this->assertEquals(1, $links[0]->id);
        $this->assertEquals(2, $links[1]->id);
        $this->assertEquals(3, $links[2]->id);
        
        // Check parent-child relationships
        $this->assertEquals(1, $links[1]->parent_id);
        $this->assertEquals(2, $links[2]->parent_id);
    }

    public function test_get_links_with_override()
    {
        $parent = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('parent.link')
            ->withUrl('/parent');

        $child = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('child.link')
            ->withUrl('/child');

        $parent->addChild($child);

        $this->repository->setOverrideLinks([$parent]);
        
        $actor = new User();
        $links = $this->repository->getLinks($actor);
        
        $this->assertInstanceOf(EloquentCollection::class, $links);
        $this->assertCount(2, $links);
        
        // Check parent-child relationships
        $this->assertEquals(1, $links[0]->id);
        $this->assertEquals(2, $links[1]->id);
        $this->assertEquals(1, $links[1]->parent_id);
    }

    public function test_guest_only_links_filtered_for_non_guests()
    {
        $link1 = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('regular.link')
            ->withUrl('/regular');

        $link2 = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('guest.link')
            ->withUrl('/guest')
            ->withGuestOnly(true);

        $this->repository->setOverrideLinks([$link1, $link2]);
        
        // Non-guest user
        $actor = new User();
        $actor->id = 1; // Non-guest users have an ID
        
        $links = $this->repository->getLinks($actor);
        
        $this->assertCount(1, $links);
        $this->assertEquals(1, $links[0]->id);
    }

    public function test_guest_links_visible_to_guests()
    {
        $link1 = LinkDefinition::make()
            ->withId(1)
            ->withTranslationKey('regular.link')
            ->withUrl('/regular');

        $link2 = LinkDefinition::make()
            ->withId(2)
            ->withTranslationKey('guest.link')
            ->withUrl('/guest')
            ->withGuestOnly(true);

        $this->repository->setOverrideLinks([$link1, $link2]);
        
        // Guest user
        $actor = new User();
        // Guest users have no ID
        
        $links = $this->repository->getLinks($actor);
        
        $this->assertCount(2, $links);
    }
}
