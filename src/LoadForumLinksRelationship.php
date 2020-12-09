<?php

namespace FoF\Links;

use Flarum\Api\Controller\ShowForumController;
use Psr\Http\Message\ServerRequestInterface;

class LoadForumLinksRelationship
{
    /**
     * @param ShowForumController $controller
     * @param $data
     * @param ServerRequestInterface $request
     */
    public function __invoke(ShowForumController $controller, &$data, ServerRequestInterface $request)
    {
        $data['links'] = Link::all();
    }
}