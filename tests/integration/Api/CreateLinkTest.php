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

use Flarum\Extend;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Links\Link;
use FoF\Links\Tests\fixtures\LinkUsersTrait;

class CreateLinkTest extends TestCase
{
    use RetrievesAuthorizedUsers;
    use LinkUsersTrait;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-links');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
            'links' => [
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'position' => null, 'is_internal' => false, 'is_newtab' => true, 'use_relme' => false, 'parent_id' => null, 'is_restricted' => false, 'guest_only' => false],
                ['id' => 2, 'title' => 'Minimal'],
            ],
        ]);
    }

    public function payload(): array
    {
        return [
            'data' => [
                'type'       => 'links',
                'attributes' => [
                    'title'      => 'Facebook',
                    'url'        => 'https://facebook.com',
                    'icon'       => 'fab fa-facebook',
                    'position'   => 0,
                    'isInternal' => true,
                    'isNewtab'   => true,
                    'useRelMe'   => true,
                    'guestOnly'  => true,
                ],
            ],
        ];
    }

    public function minimalPayload(): array
    {
        return [
            'data' => [
                'type'       => 'links',
                'attributes' => [
                    'title'      => 'Facebook',
                    'url'        => 'https://facebook.com',
                    'icon'       => 'fab fa-facebook',
                ],
            ],
        ];
    }

    /**
     * @test
     *
     * @dataProvider authorizedUsers
     */
    public function authorized_user_cannot_create_link_with_no_data(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('errors', $response);
    }

    /**
     * @test
     *
     * @dataProvider authorizedUsers
     */
    public function authorized_user_can_create_link(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
                'json'            => $this->payload(),
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('data', $response);
        $this->assertArrayHasKey('id', $response['data']);
        $this->assertEquals('Facebook', $response['data']['attributes']['title']);
        $this->assertEquals('https://facebook.com', $response['data']['attributes']['url']);
        $this->assertEquals('fab fa-facebook', $response['data']['attributes']['icon']);
        $this->assertEquals(0, $response['data']['attributes']['position']);
        $this->assertTrue($response['data']['attributes']['isInternal']);
        $this->assertTrue($response['data']['attributes']['isNewtab']);
        $this->assertTrue($response['data']['attributes']['useRelMe']);
        $this->assertFalse($response['data']['attributes']['isChild']);
        $this->assertTrue($response['data']['attributes']['guestOnly']);
        $this->assertFalse($response['data']['attributes']['isRestricted']);

        $id = $response['data']['id'];

        $link = Link::find($id);

        $this->assertNotNull($link);
        $this->assertEquals('Facebook', $link->title);
        $this->assertEquals('https://facebook.com', $link->url);
        $this->assertEquals('fab fa-facebook', $link->icon);
        $this->assertEquals(0, $link->position);
        $this->assertTrue($link->is_internal);
        $this->assertTrue($link->is_newtab);
        $this->assertTrue($link->use_relme);
        $this->assertFalse($link->is_restricted);
        $this->assertTrue($link->guest_only);
    }

    /**
     * @test
     *
     * @dataProvider authorizedUsers
     */
    public function authorized_user_can_create_link_with_minimal_data(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
                'json'            => $this->minimalPayload(),
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('data', $response);
        $this->assertArrayHasKey('id', $response['data']);
        $this->assertEquals('Facebook', $response['data']['attributes']['title']);
        $this->assertEquals('https://facebook.com', $response['data']['attributes']['url']);
        $this->assertEquals('fab fa-facebook', $response['data']['attributes']['icon']);
        $this->assertFalse($response['data']['attributes']['isRestricted']);
        $this->assertFalse($response['data']['attributes']['guestOnly']);

        $id = $response['data']['id'];

        $link = Link::find($id);

        $this->assertNotNull($link);
        $this->assertEquals('Facebook', $link->title);
        $this->assertEquals('https://facebook.com', $link->url);
        $this->assertEquals('fab fa-facebook', $link->icon);
        $this->assertFalse($response['data']['attributes']['isChild']);

        // check defaults of optional fields
        $this->assertFalse($link->is_internal);
        $this->assertFalse($link->is_newtab);
        $this->assertFalse($link->use_relme);
        $this->assertNull($link->parent_id);
        $this->assertNull($link->position);
        $this->assertFalse($link->is_restricted);
        $this->assertFalse($link->guest_only);
    }

    /**
     * @test
     *
     * @dataProvider unauthorizedUsers
     */
    public function unauthorized_cannot_create_link(?int $userId)
    {
        if (!$userId) {
            $this->extend(
                (new Extend\Csrf())
                    ->exemptRoute('links.create')
            );
        }

        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => $userId,
                'json'            => $this->payload(),
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());

        $link = Link::where('title', 'Facebook')->first();

        $this->assertNull($link);
    }
}
