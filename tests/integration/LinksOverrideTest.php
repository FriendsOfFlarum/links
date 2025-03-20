<?php

namespace FoF\Links\Tests\integration;

use Flarum\Testing\integration\TestCase;
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;

class LinksOverrideTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->extension('fof-links');
    }
    
    public function test_links_override_with_array()
    {
        $links = [
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('test.link')
                ->withUrl('/test')
        ];
        
        $override = new LinksOverride();
        $override->addLinks($links);
        
        // Test that the links array is set correctly
        $reflection = new \ReflectionProperty(LinksOverride::class, 'links');
        $reflection->setAccessible(true);
        $storedLinks = $reflection->getValue($override);
        
        $this->assertSame($links, $storedLinks);
    }
    
    public function test_links_override_with_invokable()
    {
        $override = new LinksOverride();
        $override->addLinks(TestLinksProvider::class);
        
        // Test that the links string is set correctly
        $reflection = new \ReflectionProperty(LinksOverride::class, 'links');
        $reflection->setAccessible(true);
        $storedLinks = $reflection->getValue($override);
        
        $this->assertSame(TestLinksProvider::class, $storedLinks);
    }
    
    public function test_links_override_merging()
    {
        $links1 = [
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('test1.link')
                ->withUrl('/test1')
        ];
        
        $links2 = [
            LinkDefinition::make()
                ->withId(2)
                ->withTranslationKey('test2.link')
                ->withUrl('/test2')
        ];
        
        $override = new LinksOverride();
        $override->addLinks($links1);
        $override->addLinks($links2);
        
        // Test that the links arrays are merged
        $reflection = new \ReflectionProperty(LinksOverride::class, 'links');
        $reflection->setAccessible(true);
        $storedLinks = $reflection->getValue($override);
        
        $this->assertCount(2, $storedLinks);
        $this->assertEquals(1, $storedLinks[0]->id);
        $this->assertEquals(2, $storedLinks[1]->id);
    }
}

class TestLinksProvider
{
    public function __invoke()
    {
        return [
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('provider.link')
                ->withUrl('/provider')
        ];
    }
}
