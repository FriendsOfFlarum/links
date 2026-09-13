import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import type Mithril from 'mithril';
import type Link from '../../common/models/Link';
import { type LinkOrderEntry, type MoveDirection } from '../utils/linkOrder';
type SortableStatic = typeof import('sortablejs');
type SortableInstance = InstanceType<SortableStatic>;
export default class LinksPage<CustomAttrs extends ExtensionPageAttrs = ExtensionPageAttrs> extends ExtensionPage<CustomAttrs> {
    /**
     * Dragging rearranges the DOM behind Mithril's back. Changing the key
     * rebuilds the list outright rather than diffing against a tree it did not
     * write.
     */
    forcedRefreshKey: number;
    sortable: SortableStatic | null;
    sortableInstances: SortableInstance[];
    announcement: Mithril.Children;
    refocusId: string | null;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    onremove(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    isOverridden(): boolean;
    /**
     * Both sections of the page in one column, the way core lays out an
     * extension page's settings.
     */
    content(vnode: Mithril.VnodeDOM<CustomAttrs, this>): JSX.Element;
    /**
     * Core's own settings form, given a heading of its own so it does not read as
     * part of the list above it.
     */
    settingsForm(): Mithril.Children;
    overriddenNotice(): Mithril.Children;
    list(): Mithril.Children;
    item(link: Link, links: Link[]): Mithril.Children;
    edit(link?: Link): void;
    addChild(parent: Link): void;
    onListCreate(vnode: Mithril.VnodeDOM): void;
    destroySortables(): void;
    onSortUpdate(): void;
    move(link: Link, direction: MoveDirection): void;
    announce(link: Link, order: LinkOrderEntry[]): void;
    refocus(): void;
    /**
     * The store is updated before the request comes back, so the list redraws in
     * the new order straight away.
     */
    persist(order: LinkOrderEntry[]): void;
}
export {};
