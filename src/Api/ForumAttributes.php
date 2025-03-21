<?php

/*
 * This file is part of fof/links.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Links\Api;

use Flarum\Api\Serializer\ForumSerializer;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer, mixed $model, array $attributes): array
    {
        if ($override = resolve('fof-links.override')) {
            $attributes['links.set'] = $override;
        }

        return $attributes;
    }
}
