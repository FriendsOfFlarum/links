<?php

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
