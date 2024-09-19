<?php

namespace FoF\Links\Tests\integration\Api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;

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
                ['id' => 1, 'title' => 'Google', 'url' => 'https://google.com', 'visibility' => 'everyone'],
                ['id' => 2, 'title' => 'Facebook', 'url' => 'https://facebook.com', 'visibility' => 'guests'],
                ['id' => 3, 'title' => 'Twitter', 'url' => 'https://twitter.com', 'visibility' => 'members'],
                ['id' => 4, 'title' => 'Reddit', 'url' => 'https://reddit.com', 'visibility' => 'members']
            ]
        ]);
    }

    public function forumUsersDataProvider(): array
    {
        return [
            [1],
            [2]
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

    public function searchForLink(array $links, int $id): array
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
     */
    public function guests_see_guest_and_everyone_links()
    {
        $response = $this->send(
            $this->request('GET', '/api')
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        $links = $this->extractLinksFromIncluded($data);

        $this->assertCount(2, $links);

        $link = $this->searchForLink($links, 1);

        $this->assertEquals('Google', $link['attributes']['title']);

        $link = $this->searchForLink($links, 2);

        $this->assertEquals('Facebook', $link['attributes']['title']);
    }

    /**
     * @test
     * @dataProvider forumUsersDataProvider
     */
    public function members_see_everyone_and_members_links(int $userId)
    {
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => $userId
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        $links = $this->extractLinksFromIncluded($data);

        $this->assertCount(3, $links);

        $link = $this->searchForLink($links, 1);

        $this->assertEquals('Google', $link['attributes']['title']);

        $link = $this->searchForLink($links, 3);

        $this->assertEquals('Twitter', $link['attributes']['title']);

        $link = $this->searchForLink($links, 4);

        $this->assertEquals('Reddit', $link['attributes']['title']);
    }
}
