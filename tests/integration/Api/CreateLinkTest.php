<?php

namespace FoF\Links\Tests\integration\Api;

use Flarum\Extend;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Links\Link;

class CreateLinkTest extends TestCase
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
            ],
        ]);
    }

    public function authorizedUsers(): array
    {
        return [
            [1],
        ];
    }

    public function unauthorizedUsers(): array
    {
        return [
            [null],
            [2]
        ];
    }

    public function payload(): array
    {
        return [
            'data' => [
                'type' => 'links',
                'attributes' => [
                    'title' => 'Facebook',
                    'url' => 'https://facebook.com',
                    'icon' => 'fab fa-facebook',
                    'visibility' => 'everyone',
                ],
            ],
        ];
    }

    /**
     * @test
     * @dataProvider authorizedUsers
     */
    public function authorized_user_cannot_create_link_with_no_data(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('errors', $response);
    }

    /**
     * @test
     * @dataProvider authorizedUsers
     */
    public function authorized_user_can_create_link(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
                'json' => $this->payload(),
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('data', $response);
        $this->assertArrayHasKey('id', $response['data']);
        $this->assertEquals('Facebook', $response['data']['attributes']['title']);
        $this->assertEquals('https://facebook.com', $response['data']['attributes']['url']);
        $this->assertEquals('everyone', $response['data']['attributes']['visibility']);

        $id = $response['data']['id'];

        $link = Link::find($id);

        $this->assertNotNull($link);
        $this->assertEquals('Facebook', $link->title);
        $this->assertEquals('https://facebook.com', $link->url);
        $this->assertEquals('everyone', $link->visibility);
    }

    /**
     * @test
     * @dataProvider unauthorizedUsers
     */
    public function unauthorized_cannot_create_link(?int $userId)
    {
        if (!$userId) {
            $this->extend(
                (new Extend\Csrf)
                    ->exemptRoute('links.create')
            );
        }
        
        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
                'json' => $this->payload(),
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());

        $link = Link::where('title', 'Facebook')->first();

        $this->assertNull($link);
    }
}
