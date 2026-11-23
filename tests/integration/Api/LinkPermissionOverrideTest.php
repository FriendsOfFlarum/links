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
use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\Guest;
use Flarum\User\User;
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;
use FoF\Links\LinkRepository;
use FoF\Links\Tests\fixtures\CodeLinkPolicy;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class LinkPermissionOverrideTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected const INSIDER = 'fof-links-test.insider';
    protected const MENTOR = 'fof-links-test.mentor';
    protected const BETA = 'fof-links-test.beta';

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

    protected function grant(string $permission, int ...$groupIds): void
    {
        $this->prepareDatabase([
            'group_permission' => array_map(
                fn (int $groupId) => ['permission' => $permission, 'group_id' => $groupId],
                $groupIds
            ),
        ]);
    }

    protected function link(int $id): LinkDefinition
    {
        return LinkDefinition::make()
            ->withId($id)
            ->withTranslationKey("fof-links.override.link$id")
            ->withUrl("https://link$id.example.com");
    }

    protected function label(int $id): LinkDefinition
    {
        return $this->link($id)->withUrl('');
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
    protected function linkIds(?int $actorId): array
    {
        return array_column($this->fetchForum($actorId)['data']['relationships']['links']['data'], 'id');
    }

    public static function actorsAndGrants(): array
    {
        return [
            'guest, not granted'         => ['authenticatedAs' => null, 'grantedTo' => null, 'visible' => false],
            'guest, granted to guests'   => ['authenticatedAs' => null, 'grantedTo' => Group::GUEST_ID, 'visible' => true],
            'guest, granted to members'  => ['authenticatedAs' => null, 'grantedTo' => Group::MEMBER_ID, 'visible' => false],
            'member, not granted'        => ['authenticatedAs' => 2, 'grantedTo' => null, 'visible' => false],
            'member, granted to members' => ['authenticatedAs' => 2, 'grantedTo' => Group::MEMBER_ID, 'visible' => true],
            'member, granted to guests'  => ['authenticatedAs' => 2, 'grantedTo' => Group::GUEST_ID, 'visible' => true],
            'admin, not granted'         => ['authenticatedAs' => 1, 'grantedTo' => null, 'visible' => true],
        ];
    }

    #[Test]
    #[DataProvider('actorsAndGrants')]
    public function link_with_a_permission_is_shown_only_to_actors_who_have_it(?int $authenticatedAs, ?int $grantedTo, bool $visible): void
    {
        if ($grantedTo !== null) {
            $this->grant(self::INSIDER, $grantedTo);
        }

        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->link(102)->withPermission(self::INSIDER),
        ]));

        $this->assertEquals($visible ? ['101', '102'] : ['101'], $this->linkIds($authenticatedAs));
    }

    #[Test]
    public function global_policy_can_grant_a_permission_the_groups_lack(): void
    {
        $this->extend(
            (new Extend\Policy())->globalPolicy(CodeLinkPolicy::class),
            (new LinksOverride())->addLinks([
                $this->link(101),
                $this->link(102)->withPermission(CodeLinkPolicy::GRANTED),
            ])
        );

        $this->assertEquals(['101', '102'], $this->linkIds(2));
    }

    #[Test]
    public function global_policy_can_deny_a_permission_the_groups_have(): void
    {
        $this->grant(CodeLinkPolicy::DENIED, Group::MEMBER_ID);

        $this->extend(
            (new Extend\Policy())->globalPolicy(CodeLinkPolicy::class),
            (new LinksOverride())->addLinks([
                $this->link(101),
                $this->link(102)->withPermission(CodeLinkPolicy::DENIED),
            ])
        );

        $this->assertEquals(['101'], $this->linkIds(2));
    }

    #[Test]
    public function hidden_parent_hides_its_whole_subtree(): void
    {
        $this->grant(self::MENTOR, Group::MEMBER_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->link(201)->withPermission(self::INSIDER)
                ->addChild($this->link(202))
                ->addChild($this->link(203)->withPermission(self::MENTOR)),
        ]));

        $this->assertEquals(['101'], $this->linkIds(2));
    }

    #[Test]
    public function hidden_parent_hides_its_with_parent_id_children(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->link(203)->withParentId(202),
            $this->link(201)->withPermission(self::INSIDER),
            $this->link(202)->withParentId(201),
        ]));

        $this->assertEquals(['101'], $this->linkIds(2));
        $this->assertEquals(['101', '203', '201', '202'], $this->linkIds(1));
    }

    #[Test]
    public function with_parent_id_child_of_a_hidden_nested_child_is_hidden(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(201)->addChild($this->link(202)->withPermission(self::INSIDER)),
            $this->link(210)->withParentId(202),
        ]));

        $this->assertEquals(['201'], $this->linkIds(2));
    }

    #[Test]
    public function with_parent_id_child_of_a_visible_or_unknown_parent_is_kept(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(201)->addChild($this->link(202)),
            $this->link(210)->withParentId(202),
            $this->link(220)->withParentId(999),
        ]));

        $this->assertEquals(['201', '202', '210', '220'], $this->linkIds(2));
    }

    #[Test]
    public function child_with_a_permission_is_hidden_under_an_unrestricted_parent(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(201)
                ->addChild($this->link(202))
                ->addChild($this->link(203)->withPermission(self::INSIDER)),
        ]));

        $data = $this->fetchForum(2);
        $included = array_column($data['included'], null, 'id');

        $this->assertEquals(['201', '202'], array_column($data['data']['relationships']['links']['data'], 'id'));
        $this->assertEquals('201', $included['202']['relationships']['parent']['data']['id']);
    }

    #[Test]
    public function label_whose_children_are_all_hidden_is_not_sent(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->label(301)
                ->addChild($this->link(302)->withPermission(self::MENTOR))
                ->addChild($this->link(303)->withPermission(self::BETA)),
        ]));

        $this->assertEquals(['101'], $this->linkIds(2));
    }

    #[Test]
    public function label_is_sent_with_only_the_permitted_children(): void
    {
        $this->grant(self::BETA, Group::MEMBER_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->label(301)
                ->addChild($this->link(302)->withPermission(self::MENTOR))
                ->addChild($this->link(303)->withPermission(self::BETA)),
        ]));

        $this->assertEquals(['301', '303'], $this->linkIds(2));
    }

    #[Test]
    public function nested_label_is_sent_only_when_a_link_below_it_is_visible(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(101)->withPosition(1),
            $this->label(301)->withPosition(2)
                ->addChild($this->label(302)->addChild($this->link(303)->withPermission(self::MENTOR))),
        ]));

        $this->assertEquals(['101'], $this->linkIds(2));
    }

    #[Test]
    public function nested_label_is_sent_with_its_permitted_link(): void
    {
        $this->grant(self::MENTOR, Group::MEMBER_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->link(101)->withPosition(1),
            $this->label(301)->withPosition(2)
                ->addChild($this->label(302)->addChild($this->link(303)->withPermission(self::MENTOR))),
        ]));

        $this->assertEquals(['101', '301', '302', '303'], $this->linkIds(2));
    }

    #[Test]
    public function label_whose_added_children_are_hidden_is_kept_by_a_with_parent_id_child(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->label(300)->addChild($this->link(301)->withPermission(self::INSIDER)),
            $this->link(310)->withParentId(300),
        ]));

        $this->assertEquals(['300', '310'], $this->linkIds(2));
    }

    #[Test]
    public function label_whose_with_parent_id_children_are_all_hidden_is_not_sent(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->label(300),
            $this->link(310)->withParentId(300)->withPermission(self::MENTOR),
            $this->link(311)->withParentId(300)->withPermission(self::BETA),
        ]));

        $this->assertEquals(['101'], $this->linkIds(2));
        $this->assertEquals(['101', '300', '310', '311'], $this->linkIds(1));
    }

    #[Test]
    public function label_emptied_through_a_nested_label_is_not_sent(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(101)->withPosition(1),
            $this->label(300)->withPosition(2)->addChild($this->label(301)),
            $this->link(310)->withPosition(3)->withParentId(301)->withPermission(self::INSIDER),
            $this->label(320)->withPosition(4),
            $this->label(321)->withPosition(5)->withParentId(320)->addChild($this->link(322)->withPermission(self::INSIDER)),
        ]));

        $this->assertEquals(['101'], $this->linkIds(2));
        $this->assertEquals(['101', '300', '301', '310', '320', '321', '322'], $this->linkIds(1));
    }

    #[Test]
    public function label_whose_remaining_children_are_guest_only_is_not_sent_to_members(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->label(301)
                ->addChild($this->link(302)->withGuestOnly(true))
                ->addChild($this->link(303)->withPermission(self::INSIDER)),
        ]));

        $this->assertEquals([], $this->linkIds(2));
        $this->assertEquals(['301', '302'], $this->linkIds(null));
    }

    #[Test]
    public function guest_links_from_the_repository_are_filtered_by_permission(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->link(102)->withPermission(self::INSIDER),
        ]));

        $this->linkIds(null);

        $this->assertEquals([101], resolve(LinkRepository::class)->getGuestLinks(new Guest())->pluck('id')->all());
    }

    #[Test]
    public function guest_links_from_the_repository_include_links_granted_to_guests(): void
    {
        $this->grant(self::INSIDER, Group::GUEST_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->link(101),
            $this->link(102)->withPermission(self::INSIDER),
        ]));

        $this->linkIds(null);

        $this->assertEquals([101, 102], resolve(LinkRepository::class)->getGuestLinks(new Guest())->pluck('id')->all());
    }

    #[Test]
    public function childless_label_and_link_whose_children_are_hidden_are_sent(): void
    {
        $this->extend((new LinksOverride())->addLinks([
            $this->label(401)->withPosition(1),
            $this->link(501)->withPosition(2)->addChild($this->link(502)->withPermission(self::INSIDER)),
        ]));

        $this->assertEquals(['401', '501'], $this->linkIds(2));
    }

    #[Test]
    public function guest_only_links_are_still_filtered_with_permissions(): void
    {
        $this->grant(self::INSIDER, Group::GUEST_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->link(601)->withGuestOnly(true)->withPermission(self::INSIDER),
            $this->link(602)->withGuestOnly(true)->withPermission(self::MENTOR),
            $this->link(603)->withPermission(self::INSIDER),
            $this->link(604)->withPermission(self::MENTOR),
        ]));

        $this->assertEquals(['601', '603'], $this->linkIds(null));
        $this->assertEquals(['603'], $this->linkIds(2));
        $this->assertEquals(['603', '604'], $this->linkIds(1));
    }

    #[Test]
    public function links_from_several_extenders_are_filtered_and_ordered_by_position(): void
    {
        $this->grant(self::INSIDER, Group::MEMBER_ID);

        $this->extend(
            (new LinksOverride())->addLinks([
                $this->link(101)->withPosition(2)->withPermission(self::INSIDER),
            ]),
            (new LinksOverride())->addLinks([
                $this->link(201)->withPosition(1),
                $this->link(202)->withPosition(3)->withPermission(self::MENTOR),
            ])
        );

        $this->assertEquals(['201'], $this->linkIds(null));
        $this->assertEquals(['201', '101'], $this->linkIds(2));
        $this->assertEquals(['201', '101', '202'], $this->linkIds(1));
    }

    #[Test]
    public function each_request_filters_the_shared_definitions_afresh(): void
    {
        $this->grant(self::BETA, Group::MEMBER_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->link(101)->withPosition(1)->withPermission(self::INSIDER)->addChild($this->link(102)),
            $this->label(301)->withPosition(2)
                ->addChild($this->link(302)->withPermission(self::MENTOR))
                ->addChild($this->link(303)->withPermission(self::BETA)),
        ]));

        $this->assertEquals([], $this->linkIds(null));
        $this->assertEquals(['301', '303'], $this->linkIds(2));
        $this->assertEquals(['101', '102', '301', '302', '303'], $this->linkIds(1));
        $this->assertEquals([], $this->linkIds(null));
    }

    #[Test]
    public function permission_names_are_not_sent_to_the_client(): void
    {
        $this->grant(self::INSIDER, Group::GUEST_ID);

        $this->extend((new LinksOverride())->addLinks([
            $this->label(301)->addChild($this->link(302)->withPermission(self::INSIDER)),
        ]));

        foreach ([null, 2, 1] as $actorId) {
            $response = $this->send($this->request('GET', '/api', ['authenticatedAs' => $actorId]));
            $body = (string) $response->getBody();

            $this->assertStringContainsString('link302.example.com', $body);
            $this->assertStringNotContainsString(self::INSIDER, $body);
        }
    }
}
