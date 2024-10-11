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

use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Links\Link;

class LinkVisibilityTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-links');

        $this->prepareDatabase($this->dbData());
    }

    protected function dbData(): array
    {
        return [
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'moderator', 'email' => 'mod@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'evelated', 'email' => 'elevated@machine.local', 'is_email_confirmed' => true],
                ['id' => 5, 'username' => 'elevatedplus', 'email' => 'elevatedplus@machine.local', 'is_email_confirmed' => true],
            ],
            'links' => [
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'position' => null, 'is_internal' => false, 'is_newtab' => true, 'use_relme' => false, 'parent_id' => null, 'is_restricted' => false],
                ['id' => 2, 'title' => 'Facebook', 'url' => 'https://facebook.com', 'is_restricted' => true],
                ['id' => 3, 'title' => 'Twitter', 'url' => 'https://twitter.com', 'is_restricted' => true],
                ['id' => 4, 'title' => 'Reddit', 'url' => 'https://reddit.com', 'is_restricted' => true],
                ['id' => 5, 'title' => 'FooBar', 'url' => 'https://foobar.com', 'is_restricted' => true],
                ['id' => 6, 'title' => 'BazQux', 'url' => 'https://bazqux.com', 'is_restricted' => true, 'parent_id' => 5, 'position' => 0],
                ['id' => 7, 'title' => 'QuuxQuuz', 'url' => 'https://quuxquuz.com', 'is_restricted' => true, 'parent_id' => 5, 'position' => 1],
                ['id' => 8, 'title' => 'GuestOnly', 'url' => 'https://guestonly.com', 'is_restricted' => false, 'guest_only' => true],

            ],
            'groups' => [
                ['id' => 5, 'name_singular' => 'FooBar', 'name_plural' => 'FooBars'],
                ['id' => 6, 'name_singular' => 'BazQux', 'name_plural' => 'BazQuux'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => Group::MODERATOR_ID],
                ['user_id' => 4, 'group_id' => 5],
                ['user_id' => 5, 'group_id' => 6],
            ],
            'group_permission' => [
                ['permission' => 'link1.view', 'group_id' => Group::GUEST_ID],
                ['permission' => 'link2.view', 'group_id' => 5],
                ['permission' => 'link2.view', 'group_id' => 6],
                ['permission' => 'link3.view', 'group_id' => Group::MEMBER_ID],
                ['permission' => 'link4.view', 'group_id' => Group::MODERATOR_ID],
                ['permission' => 'link4.view', 'group_id' => 5],
                // Parent & child scenarios
                ['permission' => 'link5.view', 'group_id' => 4],
                ['permission' => 'link5.view', 'group_id' => 5],
                ['permission' => 'link5.view', 'group_id' => 6],
                ['permission' => 'link6.view', 'group_id' => 5],
                ['permission' => 'link6.view', 'group_id' => 6],
                ['permission' => 'link7.view', 'group_id' => 6],
                // Guest only
                ['permission' => 'link8.view', 'group_id' => Group::GUEST_ID],
            ],
        ];
    }

    public function forumUsersDataProvider(): array
    {
        return [
            [null, [1, 8]],
            [1, [1, 2, 3, 4, 5, 6, 7]],
            [2, [1, 3]],
            [3, [1, 3, 4, 5]],
            [4, [1, 2, 3, 4, 5, 6]],
            [5, [1, 2, 3, 5, 6, 7]],
        ];
    }

    public function extractLinksFromIncluded(array $data): array
    {
        $this->assertArrayHasKey('included', $data);
        $this->assertIsArray($data['included']);

        return array_filter($data['included'], function ($item) {
            return $item['type'] === 'links';
        });
    }

    public function getLinkById(int $id, array $links): array
    {
        $result = array_filter($links, function ($link) use ($id) {
            return $link['attributes']['id'] === $id;
        });

        $this->assertCount(1, $result);

        // Return the first item
        return reset($result);
    }

    /**
     * @test
     *
     * @param int|null   $userId
     * @param array<int> $expectedLinks
     *
     * @dataProvider forumUsersDataProvider
     */
    public function user_type_sees_expected_links(?int $userId, array $expectedLinks)
    {
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        // Extract links from response data
        $links = $this->extractLinksFromIncluded($data);

        // Extract IDs from the links array
        $linkIds = array_column($links, 'id');

        // Sort both arrays to ensure order doesn't matter
        sort($linkIds);
        sort($expectedLinks);

        // Ensure the arrays contain exactly the same IDs
        $this->assertEquals($expectedLinks, $linkIds);

        // Now check for each individual link's data
        foreach ($expectedLinks as $expectedLink) {
            $link = $this->getLinkById($expectedLink, $links);
            $this->assertNotNull($link);

            $dbLink = Link::find($expectedLink);
            $this->assertNotNull($dbLink);

            $this->assertEquals($dbLink->title, $link['attributes']['title']);
            $this->assertEquals($dbLink->url, $link['attributes']['url']);
        }
    }
}
