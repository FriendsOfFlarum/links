<?php

namespace FoF\Links\Tests\fixtures;

trait LinkUsersTrait
{
    public function authorizedUsers(): array
    {
        return [
            [1],
        ];
    }

    public function unauthorizedUsers(): array
    {
        return [
            [null],
            [2],
        ];
    }
}