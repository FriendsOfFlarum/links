# FoF Links

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/links.svg)](https://packagist.org/packages/fof/links) [![Total Downloads](https://img.shields.io/packagist/dt/fof/links.svg)](https://packagist.org/packages/fof/links)

A [Flarum](http://flarum.org) extension that allows you to add links to your forum's navigation.

## Features

- Add links to your forum's navigation menu
- Support for both internal and external links
- Control link visibility based on user groups
- Guest-only links
- Hierarchical links (dropdown menus)
- Programmatic link definition via PHP

## Installation

Install with composer:

```bash
composer require fof/links
```

## Updating

```bash
composer update fof/links
php flarum cache:clear
```

## Usage

### Admin Interface

Links can be managed through the admin interface under the "Links" tab.

### Programmatic Link Definition

This extension provides a way to define links programmatically through PHP code. This can be useful in situations where there are multiple environments (ie dev, staging, production) and you want to define a set of links only once (in code), and not have to re-enter or define them via the admin interface.

Links defined in code replace all links stored in the database. While any are defined, the admin Links page shows a notice instead of the editable list, and the API refuses to create, edit or reorder links.

#### Basic Usage

```php
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;

return [
    // Other extenders...
    
    (new LinksOverride())
        ->addLinks([
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('my-extension.link')
                ->withUrl('/my-page')
                ->withIcon('fas fa-link')
                ->withIsInternal(true)
        ])
];
```

#### Hierarchical Links

You can create dropdown menus by adding child links:

```php
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;

$parent = LinkDefinition::make()
    ->withId(1)
    ->withTranslationKey('my-extension.parent')
    ->withUrl('/parent');

$child1 = LinkDefinition::make()
    ->withId(2)
    ->withTranslationKey('my-extension.child1')
    ->withUrl('/child1');

$child2 = LinkDefinition::make()
    ->withId(3)
    ->withTranslationKey('my-extension.child2')
    ->withUrl('/child2');

$parent->addChild($child1);
$parent->addChild($child2);

return [
    // Other extenders...
    
    (new LinksOverride())
        ->addLinks([$parent])
];
```

#### Using a Provider Class

For more complex scenarios, you can use a provider class. The provider is called when links are first needed (once per request lifecycle), not while the forum boots. A provider may inject `FoF\Links\LinkRepository`, and every read it makes returns the stored (database) links.

```php
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;

class MyLinksProvider
{
    public function __invoke(): array
    {
        return [
            LinkDefinition::make()
                ->withId(1)
                ->withTranslationKey('my-extension.link')
                ->withUrl('/my-page')
        ];
    }
}

return [
    // Other extenders...
    
    (new LinksOverride())
        ->addLinks(MyLinksProvider::class)
];
```

#### Several Extensions

More than one extension can add links. Each one uses its own `LinksOverride` extender:

```php
// acme/docs extend.php
return [
    (new LinksOverride())
        ->addLinks([
            LinkDefinition::make()
                ->withId(100)
                ->withTranslationKey('acme-docs.link')
                ->withUrl('/docs')
                ->withPosition(2)
        ])
];
```

```php
// acme/polls extend.php
return [
    (new LinksOverride())
        ->addLinks([
            LinkDefinition::make()
                ->withId(200)
                ->withTranslationKey('acme-polls.link')
                ->withUrl('/polls')
                ->withPosition(1)
        ])
];
```

The polls link appears first, whichever extension boots first.

- Links from every extender are combined.
- Top-level links are ordered by `withPosition()`. Links without a position count as 0, so set positions to control the order across extensions.
- Ids must be unique across all extensions, for example by giving each extension its own id range.
- Child links keep the order in which they were added with `addChild()`.

#### Permissions

A link can require a permission with `withPermission()`. This dropdown label has no URL, and each link under it has its own permission:

```php
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;

$insiders = LinkDefinition::make()
    ->withId(300)
    ->withTranslationKey('acme-insiders.links.insiders')
    ->addChild(
        LinkDefinition::make()
            ->withId(301)
            ->withTranslationKey('acme-insiders.links.mentors_lounge')
            ->withUrl('/t/mentors-lounge')
            ->withIsInternal(true)
            ->withPermission('insiders.mentorsLounge')
    )
    ->addChild(
        LinkDefinition::make()
            ->withId(302)
            ->withTranslationKey('acme-insiders.links.beta')
            ->withUrl('/t/beta-insider')
            ->withIsInternal(true)
            ->withPermission('insiders.beta')
    );

return [
    (new LinksOverride())
        ->addLinks([$insiders])
];
```

- Children inherit nothing: a child without its own permission is shown whenever its parent is.
- A hidden parent hides all of its children.
- A parent without a URL whose children are all hidden is not shown.
- The check runs through `$actor->can()`, so any extension's global policy can allow or deny it, for admins too. When no policy decides, admins pass and everyone else needs the permission through a group. Guests are checked against the Guest group, and a permission granted to Guests applies to members too.

FoF Links only checks the permission. The extension that defines the link registers and grants it, for example with a migration:

```php
// acme/insiders migrations/2026_01_01_000000_grant_insiders_permissions.php
use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'insiders.mentorsLounge' => Group::MODERATOR_ID,
    'insiders.beta'          => [Group::MODERATOR_ID, Group::MEMBER_ID],
]);
```

To let admins change who has it, register it on that extension's Permissions page in its admin JS (`allowGuest: true` adds the "Everyone" option):

```ts
// acme/insiders js/src/admin/extend.ts
import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';

export default [
  new Extend.Admin().permission(
    () => ({
      icon: 'fas fa-user-secret',
      label: app.translator.trans('acme-insiders.admin.permissions.mentors_lounge_label'),
      permission: 'insiders.mentorsLounge',
    }),
    'view'
  ),
];
```

### LinkDefinition API

The `LinkDefinition` class provides a fluent interface for defining links:

| Method | Description |
|--------|-------------|
| `withId(int $id)` | Set the link ID |
| `withTranslationKey(string $key)` | Set the translation key for the link title |
| `withUrl(string $url)` | Set the link URL |
| `withIcon(string $icon)` | Set the link icon (FontAwesome class) |
| `withIsInternal(bool $isInternal)` | Set whether the link is internal |
| `withIsNewtab(bool $isNewtab)` | Set whether the link should open in a new tab |
| `withUseRelme(bool $useRelme)` | Set whether to use rel="me" attribute |
| `withGuestOnly(bool $guestOnly)` | Set whether the link is only visible to guests |
| `withParentId(?int $parentId)` | Set the parent link ID |
| `withPosition(int $position)` | Set the position (orders top-level links) |
| `withPermission(string $permission)` | Show the link only to users with this permission |
| `addChild(LinkDefinition $child)` | Add a child link |

## Links

- [Packagist](https://packagist.org/packages/fof/links)
- [GitHub](https://github.com/FriendsOfFlarum/links)
- [Discuss](https://discuss.flarum.org/d/18335)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
