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
use Flarum\User\User;
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;
use PHPUnit\Framework\Attributes\Test;

class GuestOnlyParentOverrideTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-links');
        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
            ],
        ]);
    }

    protected function link(int $id): LinkDefinition
    {
        return LinkDefinition::make()
            ->withId($id)
            ->withTranslationKey("fof-links.override.link$id")
            ->withUrl("https://link$id.example.com");
    }

    protected function fetchForum(?int $actorId): array
    {
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => $actorId,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody(), true);
    }

    /**
     * @return list<string>
     */
    protected function linkIds(array $data): array
    {
        return array_column($data['data']['relationships']['links']['data'], 'id');
    }

    /**
     * @return list<array>
     */
    protected function includedLinks(array $data): array
    {
        return array_values(array_filter($data['included'] ?? [], fn (array $item) => $item['type'] === 'links'));
    }

    protected function parentId(array $data, string $id): ?string
    {
        $links = array_column($this->includedLinks($data), null, 'id');

        return $links[$id]['relationships']['parent']['data']['id'] ?? null;
    }

    protected function extendWithGuestOnlyParent(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([
                $this->link(201)->withGuestOnly(true)->addChild(
                    $this->link(202)->addChild($this->link(203))
                ),
                $this->link(301),
            ])
        );
    }

    protected function extendWithGuestOnlyChild(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([
                $this->link(201)
                    ->addChild($this->link(202))
                    ->addChild($this->link(203)->withGuestOnly(true)->addChild($this->link(204))),
            ])
        );
    }

    protected function extendWithParentIdChildOfGuestOnlyParent(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([
                $this->link(201)->withGuestOnly(true),
                $this->link(202)->withParentId(201),
                $this->link(301),
            ])
        );
    }

    #[Test]
    public function member_does_not_receive_a_guest_only_parent_or_its_descendants(): void
    {
        $this->extendWithGuestOnlyParent();

        $data = $this->fetchForum(2);

        $this->assertSame(['301'], array_column($this->includedLinks($data), 'id'));
        $this->assertSame(['301'], $this->linkIds($data));
    }

    #[Test]
    public function member_does_not_receive_a_guest_only_child_or_its_children(): void
    {
        $this->extendWithGuestOnlyChild();

        $data = $this->fetchForum(2);

        $this->assertSame(['201', '202'], $this->linkIds($data));
        $this->assertEqualsCanonicalizing(['201', '202'], array_column($this->includedLinks($data), 'id'));
        $this->assertSame('201', $this->parentId($data, '202'));
    }

    #[Test]
    public function member_keeps_sibling_order_and_parent_after_a_guest_only_first_child(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([
                $this->link(201)
                    ->addChild($this->link(202)->withGuestOnly(true))
                    ->addChild($this->link(203))
                    ->addChild($this->link(204))
                    ->addChild($this->link(205)),
            ])
        );

        $data = $this->fetchForum(2);
        $links = array_column($this->includedLinks($data), null, 'id');

        $this->assertSame(['201', '203', '204', '205'], $this->linkIds($data));
        $this->assertArrayNotHasKey('202', $links);

        foreach (['203', '204', '205'] as $id) {
            $this->assertSame('201', $this->parentId($data, $id));
        }

        $positions = collect(['203', '204', '205'])->map(fn (string $id) => $links[$id]['attributes']['position']);

        $this->assertSame($positions->sort()->values()->all(), $positions->all());
        $this->assertCount(3, $positions->unique());
    }

    #[Test]
    public function guest_receives_guest_only_parents_with_their_children(): void
    {
        $this->extendWithGuestOnlyParent();

        $data = $this->fetchForum(null);

        $this->assertSame(['201', '202', '203', '301'], $this->linkIds($data));
        $this->assertSame('201', $this->parentId($data, '202'));
        $this->assertSame('202', $this->parentId($data, '203'));
    }

    #[Test]
    public function guest_receives_guest_only_children_after_a_member_request(): void
    {
        $this->extendWithGuestOnlyChild();

        $this->assertSame(['201', '202'], $this->linkIds($this->fetchForum(2)));

        $data = $this->fetchForum(null);

        $this->assertSame(['201', '202', '203', '204'], $this->linkIds($data));
        $this->assertSame('201', $this->parentId($data, '203'));
        $this->assertSame('203', $this->parentId($data, '204'));
    }

    #[Test]
    public function member_does_not_receive_a_parent_id_child_of_a_guest_only_parent(): void
    {
        $this->extendWithParentIdChildOfGuestOnlyParent();

        $data = $this->fetchForum(2);

        $this->assertSame(['301'], array_column($this->includedLinks($data), 'id'));
        $this->assertSame(['301'], $this->linkIds($data));
    }

    #[Test]
    public function guest_receives_a_parent_id_child_of_a_guest_only_parent(): void
    {
        $this->extendWithParentIdChildOfGuestOnlyParent();

        $data = $this->fetchForum(null);

        $this->assertSame(['201', '202', '301'], $this->linkIds($data));
    }
}
