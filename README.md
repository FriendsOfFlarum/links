# Links by FriendsOfFlarum

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/links.svg)](https://packagist.org/packages/fof/links)

A [Flarum](http://flarum.org) extension. Manage Flarum primary navigation links. Original by @sijad.

![links_front](https://cloud.githubusercontent.com/assets/7693001/14650497/47c7c8a4-0681-11e6-9da3-3e99eb080f75.png)

### Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually with composer:

```sh
composer require fof/links
```

### Updating

```sh
composer update fof/links
```

### TODO List by Sijad

- [ ] Add sub items
- [ ] Add permission

### Links

- [Packagist](https://packagist.org/packages/fof/links)
- [GitHub](https://github.com/FriendsOfFlarum/links)
- [Sijad's Links](https://github.com/sijad/flarum-ext-links)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
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

This extension provides a way to define links programmatically through PHP code. This is useful for extensions that want to add links to the navigation menu.

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

For more complex scenarios, you can use a provider class:

```php
use FoF\Links\Extend\LinksOverride;
use FoF\Links\LinkDefinition;

class MyLinksProvider
{
    public function __invoke()
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
| `withPosition(int $position)` | Set the link position |
| `addChild(LinkDefinition $child)` | Add a child link |

## Links

- [Packagist](https://packagist.org/packages/fof/links)
- [GitHub](https://github.com/FriendsOfFlarum/links)
- [Discuss](https://discuss.flarum.org/d/18335)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
