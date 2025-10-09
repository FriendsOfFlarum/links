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
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Flarum\User\User;

class EditLinkTest extends TestCase
{
    use RetrievesAuthorizedUsers;
    use LinkUsersTrait;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-links');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
            ],
            'links' => [
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'position' => null, 'is_internal' => false, 'is_newtab' => true, 'use_relme' => false, 'parent_id' => null, 'is_restricted' => false, 'guest_only' => false],
            ],
        ]);
    }

    #[Test]
    #[DataProvider('authorizedUsers')]
    public function authorized_user_can_edit_link(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/links/1', [
                'authenticatedAs' => $userId,
                'json'            => [
                    'data' => [
                        'type'       => 'links',
                        'id'         => '1',
                        'attributes' => [
                            'title'      => 'Facebook',
                            'url'        => 'https://facebook.com',
                            'icon'       => 'fab fa-facebook',
                            'guestOnly'  => true,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $link = json_decode($response->getBody(), true)['data'];

        $this->assertEquals('Facebook', $link['attributes']['title']);
        $this->assertEquals('https://facebook.com', $link['attributes']['url']);
        $this->assertEquals('fab fa-facebook', $link['attributes']['icon']);
        $this->assertTrue($link['attributes']['guestOnly']);

        $link = Link::find(1);

        $this->assertEquals('Facebook', $link->title);
        $this->assertEquals('https://facebook.com', $link->url);
        $this->assertEquals('fab fa-facebook', $link->icon);
        $this->assertTrue($link->guest_only);
    }

    #[Test]
    #[DataProvider('authorizedUsers')]
    public function authorized_user_cannot_edit_link_with_no_data(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/links/1', [
                'authenticatedAs' => $userId,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('errors', $response);
        $this->assertCount(1, $response['errors']);
    }

    #[Test]
    #[DataProvider('authorizedUsers')]
    public function authorized_user_cannot_edit_nonexistent_link(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/links/2', [
                'authenticatedAs' => $userId,
                'json'            => [
                    'data' => [
                        'type'       => 'links',
                        'id'         => '2',
                        'attributes' => [
                            'title'      => 'Facebook',
                            'url'        => 'https://facebook.com',
                            'icon'       => 'fab fa-facebook',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(404, $response->getStatusCode());

        $this->assertNull(Link::find(2));
        $this->assertEquals(1, Link::count());
    }

    #[Test]
    #[DataProvider('unauthorizedUsers')]
    public function unauthorized_user_cannot_edit_link(?int $userId)
    {
        if (!$userId) {
            $this->extend(
                (new Extend\Csrf())
                    ->exemptRoute('links.update')
            );
        }

        $response = $this->send(
            $this->request('PATCH', '/api/links/1', [
                'authenticatedAs' => $userId,
                'json'            => [
                    'data' => [
                        'type'       => 'links',
                        'id'         => '1',
                        'attributes' => [
                            'title'      => 'Facebook',
                            'url'        => 'https://facebook.com',
                            'icon'       => 'fab fa-facebook',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());

        $link = Link::find(1);

        $this->assertEquals('Google', $link->title);
        $this->assertEquals('https://google.com', $link->url);
        $this->assertEquals('fab fa-google', $link->icon);
    }
}
