<?php

namespace FoF\Links\Event;

use Flarum\User\User;

class PermissionChanged
{
    /**
     * @var string
     */
    public $permission;

    /**
     * @var user
     */
    public $actor;

    public $data;
    
    public function __construct(string $permission, User $actor, $data)
    {
        $this->permission = $permission;
        $this->actor = $actor;
        $this->data = $data;
    }
}
