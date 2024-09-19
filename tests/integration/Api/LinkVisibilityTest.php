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
            ],
            'links' => [
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'position' => null, 'is_internal' => false, 'is_newtab' => true, 'use_relme' => false, 'visibility' => 'everyone', 'parent_id' => null],
                ['id' => 2, 'title' => 'Facebook', 'url' => 'https://facebook.com', 'visibility' => 'guests'],
                ['id' => 3, 'title' => 'Twitter', 'url' => 'https://twitter.com', 'visibility' => 'members'],
                ['id' => 4, 'title' => 'Reddit', 'url' => 'https://reddit.com', 'visibility' => 'members'],
            ],
        ]);
    }

    public function forumUsersDataProvider(): array
    {
        return [
            [null, [1, 2]],
            [1, [1, 3, 4]],
            [2, [1, 3, 4]],
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
