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

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'moderator', 'email' => 'mod@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'evelated', 'email' => 'elevated@machine.local', 'is_email_confirmed' => true],
            ],
            'links' => [
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'position' => null, 'is_internal' => false, 'is_newtab' => true, 'use_relme' => false, 'parent_id' => null, 'is_restricted' => false],
                ['id' => 2, 'title' => 'Facebook', 'url' => 'https://facebook.com', 'is_restricted' => true],
                ['id' => 3, 'title' => 'Twitter', 'url' => 'https://twitter.com', 'is_restricted' => true],
                ['id' => 4, 'title' => 'Reddit', 'url' => 'https://reddit.com', 'is_restricted' => true],
            ],
            'groups' => [
                ['id' => 5, 'name_singular' => 'FooBar', 'name_plural' => 'FooBars'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => Group::MODERATOR_ID],
                ['user_id' => 4, 'group_id' => 5],
            ],
            'group_permission' => [
                ['permission' => 'link1.view', 'group_id' => Group::GUEST_ID],
                ['permission' => 'link2.view', 'group_id' => 5],
                ['permission' => 'link3.view', 'group_id' => Group::MEMBER_ID],
                ['permission' => 'link4.view', 'group_id' => Group::MODERATOR_ID],
                ['permission' => 'link4.view', 'group_id' => 5],
            ],
        ]);
    }

    public function forumUsersDataProvider(): array
    {
        return [
            [null, [1]],
            [1, [1, 2, 3, 4]],
            [2, [1, 3]],
            [3, [1, 3, 4]],
            [4, [1, 2, 3, 4]],
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

        $links = $this->extractLinksFromIncluded($data);

        $this->assertEquals(count($expectedLinks), count($links));

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
