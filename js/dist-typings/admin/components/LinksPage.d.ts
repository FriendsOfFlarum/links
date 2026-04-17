import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export default class LinksPage extends ExtensionPage {
    forcedRefreshKey: number;
    sections(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): ItemList<unknown>;
    links(): Mithril.Children;
    linksPreset(): Mithril.Children;
    linksContent(): Mithril.Children;
    onListOnCreate(vnode: Mithril.VnodeDOM): void;
    onSortUpdate(): void;
}
