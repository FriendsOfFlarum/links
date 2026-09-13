import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import type LinkModel from '../../common/models/Link';
export interface ILinkItemAttrs extends ComponentAttrs {
    link: LinkModel;
    className?: string;
    /** Rendered as a menu entry rather than as a header button. */
    inDropdown?: boolean;
}
export default class LinkItem<CustomAttrs extends ILinkItemAttrs = ILinkItemAttrs> extends Component<CustomAttrs> {
    /**
     * Read by `listItems`, which marks the `<li>` around an active item. Core
     * highlights an active menu entry from there.
     */
    static isActive(attrs: ILinkItemAttrs): boolean;
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
    rel(): string | undefined;
}
