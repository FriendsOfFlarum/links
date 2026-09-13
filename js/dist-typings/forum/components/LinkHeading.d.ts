import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import type LinkModel from '../../common/models/Link';
export interface ILinkHeadingAttrs extends ComponentAttrs {
    link: LinkModel;
}
/**
 * A label inside a menu, shown as core's menu heading.
 */
export default class LinkHeading<CustomAttrs extends ILinkHeadingAttrs = ILinkHeadingAttrs> extends Component<CustomAttrs> {
    /** Renders its own `<li>`, so `listItems` does not wrap it in another. */
    static isListItem: boolean;
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
}
