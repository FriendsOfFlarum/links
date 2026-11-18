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

For more complex scenarios, you can use a provider class. The provider is called when links are first needed (once per request lifecycle), not while the forum boots. A provider may inject `FoF\Links\LinkRepository` to read stored links through `all()` or `query()`, but must not call `getLinks()` or `getGuestLinks()`, which return the override links the provider is building.

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
| `addChild(LinkDefinition $child)` | Add a child link |

## Links

- [Packagist](https://packagist.org/packages/fof/links)
- [GitHub](https://github.com/FriendsOfFlarum/links)
- [Discuss](https://discuss.flarum.org/d/18335)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
