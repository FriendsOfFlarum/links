<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Tests\integration\Api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Links\LinkDefinition;

class LinkOverrideTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-links');
        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
            'links' => [
                [
                    'id'            => 1,
                    'title'         => 'Google',
                    'icon'          => 'fab fa-google',
                    'url'           => 'https://google.com',
                    'position'      => null,
                    'is_internal'   => false,
                    'is_newtab'     => true,
                    'use_relme'     => false,
                    'parent_id'     => null,
                    'is_restricted' => false,
                ],
            ],
        ]);

        // Register the override extender using the test helper.
        $this->extend(
            (new \FoF\Links\Extend\LinksOverride())
                ->addLinks($this->overrideLinksData())
        );
    }

    /**
     * Returns an array of override link definitions.
     *
     * Three override links are defined:
     * - One with id=101, normal (not guest-only)
     * - One with id=102, marked as guest-only
     * - One with id=1 to override the DB link ("Google") with different data.
     *
     * @return LinkDefinition[]
     */
    protected function overrideLinksData(): array
    {
        return [
            // Override link that does not restrict to guests.
            LinkDefinition::make()
                ->withId(101)
                ->withTranslationKey('fof-links.override.override1')
                ->withUrl('https://override1.com')
                ->withIcon('fas fa-override1')
                ->withIsInternal(false)
                ->withIsNewtab(true)
                ->withUseRelme(false)
                ->withGuestOnly(false)
                ->withParentId(null),
            // Override link that is guest-only.
            LinkDefinition::make()
                ->withId(102)
                ->withTranslationKey('fof-links.override.override2')
                ->withUrl('https://overrideguest.com')
                ->withIcon('fas fa-overrideguest')
                ->withIsInternal(false)
                ->withIsNewtab(true)
                ->withUseRelme(false)
                ->withGuestOnly(true)
                ->withParentId(null),
            // Override link that conflicts with the DB link (id=1); should override it.
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('fof-links.override.overridegoogle')
                ->withUrl('https://overridegoogle.com')
                ->withIcon('fas fa-overridegoogle')
                ->withIsInternal(false)
                ->withIsNewtab(false)
                ->withUseRelme(false)
                ->withGuestOnly(false)
                ->withParentId(null),
        ];
    }

    /**
     * Helper: Extracts links from the API response.
     *
     * @param array $data
     *
     * @return array
     */
    protected function getLinksFromResponse(array $data): array
    {
        $this->assertArrayHasKey('included', $data);
        $links = array_filter($data['included'], function ($item) {
            return $item['type'] === 'links';
        });

        return array_values($links);
    }

    /**
     * Test that a guest sees all override links, including guest-only ones,
     * and that a DB link is overridden if its ID is defined in the override.
     */
    public function testOverrideForGuest()
    {
        // Make a guest request.
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => null,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);
        $links = $this->getLinksFromResponse($data);

        // For a guest, all override links should be visible.
        $linkIds = array_column($links, 'id');
        sort($linkIds);
        $expectedIds = [1, 101, 102]; // Note: id=1 is from the override, not the DB.
        sort($expectedIds);
        $this->assertEquals($expectedIds, $linkIds);

        // Verify that the override has replaced the DB link for id=1.
        foreach ($links as $link) {
            if ($link['id'] == 1) {
                $this->assertEquals('fof-links.override.overridegoogle', $link['attributes']['title']);
            }
        }
    }

    /**
     * Test that an authenticated user does not see override links marked as guest-only.
     */
    public function testOverrideForAuthenticatedUser()
    {
        // Make an authenticated request (using user id 1 from DB).
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);
        $links = $this->getLinksFromResponse($data);

        $linkIds = array_column($links, 'id');
        sort($linkIds);
        // For an authenticated user, the guest-only link (id 102) should be filtered out.
        $expectedIds = [1, 101];
        sort($expectedIds);
        $this->assertEquals($expectedIds, $linkIds);
    }

    /**
     * Test that when override links are set, the database links are not merged.
     * In particular, the DB link with id=1 should be completely replaced by the override.
     */
    public function testNoDbLinksIncludedWhenOverrideIsSet()
    {
        // Make a guest request.
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => null,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $links = $this->getLinksFromResponse($data);

        // The only links present should be those from the override.
        $linkIds = array_column($links, 'id');
        sort($linkIds);
        $expectedIds = [1, 101, 102];
        sort($expectedIds);
        $this->assertEquals($expectedIds, $linkIds);

        // Verify that the DB link "Google" is not used; the override should replace it.
        $overrideGoogle = null;
        foreach ($links as $link) {
            if ($link['id'] == 1) {
                $overrideGoogle = $link;
            }
        }
        $this->assertNotNull($overrideGoogle);
        $this->assertEquals('fof-links.override.overridegoogle', $overrideGoogle['attributes']['title']);
    }
}
