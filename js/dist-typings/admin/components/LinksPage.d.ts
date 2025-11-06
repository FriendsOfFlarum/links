export default class LinksPage extends ExtensionPage<import("flarum/admin/components/ExtensionPage").ExtensionPageAttrs> {
    constructor();
    oninit(vnode: any): void;
    forcedRefreshKey: number | undefined;
    sections(): import("flarum/common/utils/ItemList").default<unknown>;
    links(): JSX.Element;
    linksPreset(): JSX.Element;
    linksContent(): JSX.Element;
    onListOnCreate(vnode: any): void;
    onSortUpdate(e: any): void;
}
import ExtensionPage from "flarum/admin/components/ExtensionPage";
