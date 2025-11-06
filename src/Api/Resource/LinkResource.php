<?php

namespace FoF\Links\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use Flarum\Foundation\ValidationException;
use FoF\Links\Concerns\ChecksOverride;
use FoF\Links\Event\Created;
use FoF\Links\Event\Creating;
use FoF\Links\Event\Deleted;
use FoF\Links\Event\Deleting;
use FoF\Links\Event\Saving;
use FoF\Links\Link;
use FoF\Links\LinkValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<Link>
 */
class LinkResource extends Resource\AbstractDatabaseResource
{
    use ChecksOverride;

    public function __construct(
        protected LinkValidator $validator,
        protected Dispatcher $events
    ) {
    }

    public function type(): string
    {
        return 'links';
    }

    public function model(): string
    {
        return Link::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Create::make()
                ->authenticated()
                ->can('createLink')
                ->defaultInclude(['parent'])
                ->before(function (Context $context) {
                    if ($this->linksAreOverridden()) {
                        $this->notValid();
                    }
                }),
            
            Endpoint\Update::make()
                ->authenticated()
                ->can('update')
                ->before(function (Context $context) {
                    if ($this->linksAreOverridden()) {
                        $this->notValid();
                    }
                }),
            
            Endpoint\Delete::make()
                ->authenticated()
                ->can('delete'),
            
            Endpoint\Index::make()
                ->defaultInclude(['parent']),
            
            Endpoint\Show::make()
                ->defaultInclude(['parent']),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('title')
                ->requiredOnCreate()
                ->maxLength(255)
                ->writable(),

            Schema\Str::make('icon')
                ->nullable()
                ->maxLength(255)
                ->writable(),

            Schema\Str::make('url')
                ->nullable()
                ->maxLength(255)
                ->writable(),

            Schema\Integer::make('position')
                ->nullable(),

            Schema\Boolean::make('isInternal')
                ->property('is_internal')
                ->default(false)
                ->writable(),

            Schema\Boolean::make('isNewtab')
                ->property('is_newtab')
                ->default(false)
                ->writable(),

            Schema\Boolean::make('useRelMe')
                ->property('use_relme')
                ->default(false)
                ->writable(),

            Schema\Boolean::make('isRestricted')
                ->property('is_restricted')
                ->default(false)
                ->visible(fn (Link $link, Context $context) => $context->getActor()->isAdmin())
                ->writable(fn (Link $link, Context $context) => $context->getActor()->isAdmin()),

            Schema\Boolean::make('guestOnly')
                ->property('guest_only')
                ->default(false)
                ->visible(fn (Link $link, Context $context) => $context->getActor()->isAdmin())
                ->writable(fn (Link $link, Context $context) => $context->getActor()->isAdmin()),

            Schema\Boolean::make('isChild')
                ->get(fn (Link $link) => (bool) $link->parent_id),

            Schema\Relationship\ToOne::make('parent')
                ->type('links')
                ->includable()
                ->writable(fn (Link $link, Context $context) => $context->creating())
                ->set(function (Link $link, ?Link $parent, Context $context) {
                    if ($parent === null) {
                        // Setting parent to root level
                        $rootLinks = Link::query()->whereNull('parent_id')->whereNotNull('position');
                        $link->position = $rootLinks->max('position') + 1;
                        $link->parent_id = null;
                    } else {
                        // Setting parent to another link
                        $position = Link::query()->where('parent_id', $parent->id)->max('position');
                        $link->parent_id = $parent->id;
                        $link->position = $position === null ? 0 : $position + 1;
                    }
                }),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('position'),
        ];
    }

    public function creating(object $model, OriginalContext $context): ?object
    {
        /** @var Link $model */
        $actor = $context->getActor();
        $data = $context->body()['data'] ?? [];

        // Fire Creating event
        $this->events->dispatch(new Creating($model, $actor, $data));

        // Validate
        $this->validator->assertValid($model->getAttributes());

        return $model;
    }

    public function created(object $model, OriginalContext $context): ?object
    {
        /** @var Link $model */
        $actor = $context->getActor();

        // Fire Created event
        $this->events->dispatch(new Created($model, $actor, []));

        return $model;
    }

    public function updating(object $model, OriginalContext $context): ?object
    {
        /** @var Link $model */
        $actor = $context->getActor();
        $data = $context->body()['data'] ?? [];

        // Fire Saving event
        $this->events->dispatch(new Saving($model, $actor, $data));

        // Validate only changed attributes
        if ($model->isDirty()) {
            $this->validator->assertValid($model->getDirty());
        }

        return $model;
    }

    public function deleting(object $model, OriginalContext $context): void
    {
        /** @var Link $model */
        $data = $context->body()['data'] ?? [];

        $this->events->dispatch(new Deleting($model, $context->getActor(), $data));
    }

    public function deleted(object $model, OriginalContext $context): void
    {
        $data = $context->body()['data'] ?? [];
        $this->events->dispatch(new Deleted($model, $context->getActor(), $data));
    }
}
