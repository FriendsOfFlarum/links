<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Group\Permission;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int    $id
 * @property string $title
 * @property string $icon
 * @property string $url
 * @property int    $position
 * @property bool   $is_internal
 * @property bool   $is_newtab
 * @property bool   $use_relme
 * @property int    $parent_id
 * @property Link   $parent
 * @property bool   $is_restricted
 * @property bool   $guest_only
 */
class Link extends AbstractModel
{
    use ScopeVisibilityTrait;

    /**
     * {@inheritdoc}
     */
    protected $table = 'links';

    /**
     * @var array
     */
    protected $casts = [
        'is_internal'           => 'boolean',
        'is_newtab'             => 'boolean',
        'use_relme'             => 'boolean',
        'is_restricted'         => 'boolean',
        'guest_only'            => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();

        static::saved(function (self $link) {
            if ($link->wasUnrestricted()) {
                $link->deletePermissions();
            }
        });

        static::deleted(function (self $link) {
            $link->deletePermissions();
        });
    }

    /**
     * Create a new link.
     *
     * @param string $name
     * @param string $icon
     * @param string $url
     * @param bool   $isInternal
     * @param bool   $isNewtab
     *
     * @return static
     */
    public static function build($name, $icon, $url, $isInternal, $isNewtab, $useRelMe = false, $guestOnly = false)
    {
        $link = new static();

        $link->title = $name;
        $link->icon = $icon;
        $link->url = $url;
        $link->is_internal = (bool) $isInternal;
        $link->is_newtab = (bool) $isNewtab;
        $link->use_relme = (bool) $useRelMe;
        $link->guest_only = (bool) $guestOnly;

        return $link;
    }

    public function parent()
    {
        return $this->belongsTo(self::class);
    }

    public function save(array $options = []): bool
    {
        $result = parent::save($options);

        resolve(LinkRepository::class)->clearLinksCache();

        return $result;
    }

    public function delete()
    {
        $result = parent::delete();

        resolve(LinkRepository::class)->clearLinksCache();

        return $result;
    }

    public function scopeWhereHasPermission(Builder $query, User $user, string $currPermission): Builder
    {
        $isAdmin = $user->isAdmin();
        $allPermissions = $user->getPermissions();
        $linkIdsWithPermission = collect($allPermissions)
            ->filter(function ($permission) use ($currPermission) {
                return substr($permission, 0, 4) === 'link' && strpos($permission, $currPermission) !== false;
            })
            ->map(function ($permission) {
                $scopeFragment = explode('.', $permission, 2)[0];

                return substr($scopeFragment, 4);
            })
            ->values();

        return $query
            ->where(function ($query) use ($isAdmin, $linkIdsWithPermission) {
                $query
                    ->whereIn('links.id', function ($query) use ($isAdmin, $linkIdsWithPermission) {
                        static::buildPermissionSubquery($query, $isAdmin, $linkIdsWithPermission);
                    })
                    ->where(function ($query) use ($isAdmin, $linkIdsWithPermission) {
                        $query
                            ->whereIn('links.parent_id', function ($query) use ($isAdmin, $linkIdsWithPermission) {
                                static::buildPermissionSubquery($query, $isAdmin, $linkIdsWithPermission);
                            })
                            ->orWhere('links.parent_id', null);
                    });
            });
    }

    protected static function buildPermissionSubquery($base, $isAdmin, $linkIdsWithPermission)
    {
        $base
            ->from('links as perm_links')
            ->select('perm_links.id');

        // This needs to be a special case, as `linkIdsWithPermissions`
        // won't include admin perms (which are all perms by default).
        if ($isAdmin) {
            return;
        }

        $base->where(function ($query) use ($linkIdsWithPermission) {
            $query
                ->where('perm_links.is_restricted', true)
                ->whereIn('perm_links.id', $linkIdsWithPermission);
        });

        $base->orWhere('perm_links.is_restricted', false);
    }

    /**
     * Has this link been unrestricted recently?
     *
     * @return bool
     */
    public function wasUnrestricted()
    {
        return !$this->is_restricted && $this->wasChanged('is_restricted');
    }

    /**
     * Delete all permissions belonging to this link.
     */
    public function deletePermissions()
    {
        Permission::where('permission', 'like', "link{$this->id}.%")->delete();
    }
}
