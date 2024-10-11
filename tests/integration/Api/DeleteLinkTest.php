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

class DeleteLinkTest extends TestCase
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
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'position' => null, 'is_internal' => false, 'is_newtab' => true, 'use_relme' => false, 'parent_id' => null],
            ],
        ]);
    }

    /**
     * @test
     *
     * @dataProvider authorizedUsers
     */
    public function authorized_user_can_delete_link(int $userId)
    {
        $response = $this->send(
            $this->request('DELETE', '/api/links/1', [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());

        $this->assertNull(Link::find(1));
        $this->assertEquals(0, Link::count());
    }

    /**
     * @test
     *
     * @dataProvider authorizedUsers
     */
    public function authorized_user_cannot_delete_nonexistent_link(int $userId)
    {
        $response = $this->send(
            $this->request('DELETE', '/api/links/2', [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(404, $response->getStatusCode());

        $this->assertNull(Link::find(2));
        $this->assertEquals(1, Link::count());
    }

    /**
     * @test
     *
     * @dataProvider unauthorizedUsers
     */
    public function unauthorized_user_cannot_delete_link(?int $userId)
    {
        if (!$userId) {
            $this->extend(
                (new Extend\Csrf())
                    ->exemptRoute('links.delete')
            );
        }

        $response = $this->send(
            $this->request('DELETE', '/api/links/1', [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());

        $this->assertNotNull(Link::find(1));
        $this->assertEquals(1, Link::count());
    }

    /**
     * @test
     *
     * @dataProvider unauthorizedUsers
     */
    public function unauthorized_user_cannot_delete_nonexistent_link(?int $userId)
    {
        if (!$userId) {
            $this->extend(
                (new Extend\Csrf())
                    ->exemptRoute('links.delete')
            );
        }

        $response = $this->send(
            $this->request('DELETE', '/api/links/2', [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(404, $response->getStatusCode());

        $this->assertNull(Link::find(2));
        $this->assertEquals(1, Link::count());
    }
}
