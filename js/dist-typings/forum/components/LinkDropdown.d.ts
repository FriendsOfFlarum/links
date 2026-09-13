import SplitDropdown, { ISplitDropdownAttrs } from 'flarum/common/components/SplitDropdown';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type LinkModel from '../../common/models/Link';
export interface ILinkDropdownAttrs extends ISplitDropdownAttrs {
    link: LinkModel;
    className?: string;
}
/**
 * A group led by a link. The link stays one click away, beside the caret that
 * opens the links under it.
 */
export default class LinkDropdown<CustomAttrs extends ILinkDropdownAttrs = ILinkDropdownAttrs> extends SplitDropdown<CustomAttrs> {
    static initAttrs(attrs: ILinkDropdownAttrs): void;
    view(vnode: Mithril.Vnode<CustomAttrs, this>): JSX.Element;
    /**
     * Core copies the first menu entry onto a `<button>`, which cannot carry a
     * link, so the group's link is rendered as itself.
     */
    getButton(): Mithril.Vnode<any, any>;
    items(): ItemList<Mithril.Children>;
}
