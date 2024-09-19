<?php

namespace FoF\Links\Access;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ScopeLinkVisibility
{
    /**
     * @param User $actor
     * @param Builder $query
     */
    public function __invoke(User $actor, Builder $query)
    {
        $query->where('visibility', 'everyone');
        
        if ($actor->isGuest()) {
            $query
                ->orWhere('visibility', 'guests');
        } else {
            $query
                ->orWhere('visibility', 'members');
        }
    }
}
