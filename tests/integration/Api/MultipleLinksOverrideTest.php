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
use FoF\Links\Link;
use FoF\Links\LinkDefinition;
use FoF\Links\LinkRepository;
use PHPUnit\Framework\Attributes\Test;

class MultipleLinksOverrideTest extends TestCase
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
                    'guest_only'    => false,
                ],
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
     * @return array<string, array>
     */
    protected function includedLinks(array $data): array
    {
        $links = array_filter($data['included'] ?? [], fn (array $item) => $item['type'] === 'links');

        return array_column($links, null, 'id');
    }

    #[Test]
    public function links_from_several_extenders_are_all_shown(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)]),
            (new LinksOverride())->addLinks([$this->link(301)])
        );

        $this->assertEquals(['201', '301'], $this->linkIds($this->fetchForum(null)));
    }

    #[Test]
    public function links_from_several_extenders_are_ordered_by_position(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)->withPosition(2)]),
            (new LinksOverride())->addLinks([$this->link(301)->withPosition(1)])
        );

        $this->assertEquals(['301', '201'], $this->linkIds($this->fetchForum(null)));
    }

    #[Test]
    public function children_from_several_extenders_keep_their_own_parent(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)->addChild($this->link(202))]),
            (new LinksOverride())->addLinks([$this->link(301)->addChild($this->link(302))])
        );

        $data = $this->fetchForum(null);
        $included = $this->includedLinks($data);

        $this->assertEquals(['201', '202', '301', '302'], $this->linkIds($data));
        $this->assertEquals('201', $included['202']['relationships']['parent']['data']['id']);
        $this->assertEquals('301', $included['302']['relationships']['parent']['data']['id']);
        $this->assertTrue($included['202']['attributes']['isChild']);
        $this->assertTrue($included['302']['attributes']['isChild']);
        $this->assertFalse($included['201']['attributes']['isChild']);
        $this->assertFalse($included['301']['attributes']['isChild']);
    }

    #[Test]
    public function guest_only_links_from_one_extender_are_hidden_from_members(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)->withGuestOnly(true)]),
            (new LinksOverride())->addLinks([$this->link(301)])
        );

        $this->assertEquals(['201', '301'], $this->linkIds($this->fetchForum(null)));
        $this->assertEquals(['301'], $this->linkIds($this->fetchForum(2)));
    }

    #[Test]
    public function member_links_stay_a_json_list_after_guest_only_links_are_removed(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([
                $this->link(301)->withPosition(2),
                $this->link(201)->withGuestOnly(true)->withPosition(1),
            ])
        );

        $data = $this->fetchForum(2);

        $this->assertTrue(array_is_list($data['data']['relationships']['links']['data']));
        $this->assertEquals(['301'], $this->linkIds($data));
    }

    #[Test]
    public function database_links_are_ignored_with_several_extenders(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)]),
            (new LinksOverride())->addLinks([$this->link(301)])
        );

        $this->assertEquals(['201', '301'], $this->linkIds($this->fetchForum(2)));
    }

    #[Test]
    public function several_extenders_lock_link_management(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)]),
            (new LinksOverride())->addLinks([$this->link(301)])
        );

        $response = $this->send(
            $this->request('POST', '/api/links', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'type'       => 'links',
                        'attributes' => [
                            'title' => 'Facebook',
                            'url'   => 'https://facebook.com',
                            'icon'  => 'fab fa-facebook',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
        $this->assertEquals([1], Link::query()->pluck('id')->all());
        $this->assertNotEmpty($this->fetchForum(1)['data']['attributes']['links.set']);
    }

    #[Test]
    public function array_and_provider_extenders_are_both_shown(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks([$this->link(201)]),
            (new LinksOverride())->addLinks(CountingLinksProvider::class)
        );

        $this->assertEquals(['201', '501'], $this->linkIds($this->fetchForum(null)));
    }

    #[Test]
    public function provider_returning_no_links_does_not_override(): void
    {
        $this->extend((new LinksOverride())->addLinks(EmptyLinksProvider::class));

        $data = $this->fetchForum(2);

        $this->assertNull($data['data']['attributes']['links.set']);
        $this->assertEquals(['1'], $this->linkIds($data));
    }

    #[Test]
    public function provider_returning_null_adds_no_links_beside_an_array_extender(): void
    {
        $this->extend(
            (new LinksOverride())->addLinks(NullLinksProvider::class),
            (new LinksOverride())->addLinks([$this->link(201)])
        );

        $this->assertEquals(['201'], $this->linkIds($this->fetchForum(null)));
    }

    #[Test]
    public function provider_is_invoked_when_links_are_needed_not_at_boot(): void
    {
        CountingLinksProvider::$invocations = 0;

        $this->extend((new LinksOverride())->addLinks(CountingLinksProvider::class));

        $this->app();

        $this->assertSame(0, CountingLinksProvider::$invocations);

        $this->assertEquals(['501'], $this->linkIds($this->fetchForum(null)));
        $this->assertGreaterThanOrEqual(1, CountingLinksProvider::$invocations);
    }

    #[Test]
    public function single_extender_without_positions_keeps_definition_order(): void
    {
        $this->extend((new LinksOverride())->addLinks([$this->link(402), $this->link(401)]));

        $data = $this->fetchForum(null);
        $included = $this->includedLinks($data);

        $this->assertEquals(['402', '401'], $this->linkIds($data));
        $this->assertNull($included['402']['attributes']['position']);
        $this->assertNull($included['401']['attributes']['position']);
    }

    #[Test]
    public function providers_can_read_stored_links_through_the_repository(): void
    {
        $this->extend((new LinksOverride())->addLinks(RepositoryReadingLinksProvider::class));

        foreach ([null, 2] as $actorId) {
            $data = $this->fetchForum($actorId);

            $this->assertEquals(['601'], $this->linkIds($data));
            $this->assertEquals('https://google.com', $this->includedLinks($data)['601']['attributes']['url']);
        }
    }
}

class EmptyLinksProvider
{
    public function __invoke(): array
    {
        return [];
    }
}

class NullLinksProvider
{
    public function __invoke(): ?array
    {
        return null;
    }
}

class CountingLinksProvider
{
    public static int $invocations = 0;

    public function __invoke(): array
    {
        static::$invocations++;

        return [
            LinkDefinition::make()
                ->withId(501)
                ->withTranslationKey('fof-links.override.link501')
                ->withUrl('https://link501.example.com'),
        ];
    }
}

class RepositoryReadingLinksProvider
{
    public function __construct(protected LinkRepository $links)
    {
    }

    public function __invoke(): array
    {
        return $this->links->all()->map(
            fn (Link $link) => LinkDefinition::make()
                ->withId(600 + $link->id)
                ->withTranslationKey($link->title)
                ->withUrl($link->url)
        )->all();
    }
}
