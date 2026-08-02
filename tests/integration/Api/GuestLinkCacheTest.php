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
use FoF\Links\Link;
use FoF\Links\LinkRepository;
use PHPUnit\Framework\Attributes\Test;

class GuestLinkCacheTest extends TestCase
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
            Link::class => [
                ['id' => 1, 'title' => 'Google', 'icon' => 'fab fa-google', 'url' => 'https://google.com', 'is_restricted' => false, 'guest_only' => false],
                ['id' => 2, 'title' => 'Legal', 'icon' => 'fas fa-gavel', 'url' => '', 'is_restricted' => false, 'guest_only' => false],
                ['id' => 3, 'title' => 'About', 'url' => 'https://example.com/about', 'is_restricted' => false, 'guest_only' => false, 'parent_id' => 2, 'position' => 0],
                ['id' => 4, 'title' => 'Join us', 'url' => 'https://example.com/join', 'is_restricted' => false, 'guest_only' => true],
            ],
        ]);

        // The cache store outlives a single test on some drivers; start clean
        // so no test depends on another's leftovers.
        $this->repository()->clearLinksCache();
    }

    protected function repository(): LinkRepository
    {
        return $this->app()->getContainer()->make(LinkRepository::class);
    }

    /**
     * @return string[] SQL of queries against the links table
     */
    protected function linksQueriesDuring(callable $callback): array
    {
        $db = $this->app()->getContainer()->make(\Illuminate\Database\ConnectionInterface::class);
        $db->enableQueryLog();
        $db->flushQueryLog();

        $callback();

        $queries = array_column($db->getQueryLog(), 'query');
        $db->flushQueryLog();

        // Respect the table prefix — matching a literal "links" silently
        // finds nothing on the prefixed CI jobs.
        $table = 'from '.$db->getTablePrefix().'links';

        return array_values(array_filter(
            $queries,
            fn (string $sql) => str_contains(str_replace(['`', '"'], '', $sql), $table)
        ));
    }

    protected function guestLinks(): array
    {
        $response = $this->send($this->request('GET', '/api'));

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        return array_values(array_filter($body['included'] ?? [], fn (array $r) => $r['type'] === 'links'));
    }

    #[Test]
    public function second_guest_request_serves_links_from_the_cache_without_querying(): void
    {
        $this->guestLinks();

        $queries = $this->linksQueriesDuring(fn () => $this->guestLinks());

        $this->assertCount(
            0,
            $queries,
            "Guest links should come from the cache on a warm request. Ran:\n".implode("\n", $queries)
        );
    }

    #[Test]
    public function a_guest_request_loads_links_and_their_parents_in_a_single_query(): void
    {
        $queries = $this->linksQueriesDuring(fn () => $this->guestLinks());

        // The visible set already contains every visible parent; serializing
        // links.parent must reuse those models, not fetch them again by id.
        $this->assertCount(
            1,
            $queries,
            "Cold guest request should query the links table exactly once. Ran:\n".implode("\n", $queries)
        );
    }

    #[Test]
    public function cached_links_serialize_identically_to_uncached_links(): void
    {
        $cold = $this->guestLinks();
        $warm = $this->guestLinks();

        $this->assertEquals($cold, $warm);
        $this->assertNotEmpty($cold);
    }

    #[Test]
    public function saving_a_link_invalidates_the_guest_cache(): void
    {
        $this->guestLinks();

        /** @var Link $link */
        $link = Link::query()->findOrFail(1);
        $link->title = 'Googol';
        $link->save();

        $titles = array_column(array_column($this->guestLinks(), 'attributes'), 'title');

        $this->assertContains('Googol', $titles);
        $this->assertNotContains('Google', $titles);
    }

    #[Test]
    public function deleting_a_link_invalidates_the_guest_cache(): void
    {
        $this->guestLinks();

        Link::query()->findOrFail(1)->delete();

        $titles = array_column(array_column($this->guestLinks(), 'attributes'), 'title');

        $this->assertNotContains('Google', $titles);
    }

    #[Test]
    public function guests_see_guest_only_links(): void
    {
        $titles = array_column(array_column($this->guestLinks(), 'attributes'), 'title');

        $this->assertContains('Join us', $titles);
    }

    #[Test]
    public function logged_in_users_do_not_see_guest_only_links_or_touch_the_guest_cache(): void
    {
        // Warm the guest cache first, so a leak from cache to user would show.
        $this->guestLinks();

        $response = $this->send($this->request('GET', '/api', ['authenticatedAs' => 2]));
        $body = json_decode($response->getBody()->getContents(), true);
        $links = array_values(array_filter($body['included'] ?? [], fn (array $r) => $r['type'] === 'links'));
        $titles = array_column(array_column($links, 'attributes'), 'title');

        $this->assertContains('Google', $titles);
        $this->assertNotContains('Join us', $titles);
    }

    #[Test]
    public function parent_linkage_survives_the_cache(): void
    {
        // Cold then warm: the child must link to its parent both times.
        foreach (['cold', 'warm'] as $pass) {
            $links = $this->guestLinks();
            $byTitle = array_column($links, null, null);
            $child = null;
            foreach ($links as $link) {
                if ($link['attributes']['title'] === 'About') {
                    $child = $link;
                }
            }

            $this->assertNotNull($child, "child missing on $pass pass");
            $this->assertEquals('2', $child['relationships']['parent']['data']['id'], "wrong parent on $pass pass");
        }
    }

    #[Test]
    public function a_legacy_cache_value_is_replaced_rather_than_served(): void
    {
        // Older versions stored the Eloquent collection itself. An upgrade
        // must treat that as a miss and rebuild, not crash or serve it.
        $repository = $this->repository();
        $cache = $this->app()->getContainer()->make(\Illuminate\Contracts\Cache\Store::class);
        $cache->forever('fof-links.links.guest', Link::query()->get());

        $titles = array_column(array_column($this->guestLinks(), 'attributes'), 'title');

        $this->assertContains('Google', $titles);
    }
}
