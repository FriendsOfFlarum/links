import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import type Link from '../../common/models/Link';
import type { MoveDirection } from '../utils/linkOrder';
export interface ILinkListItemAttrs extends ComponentAttrs {
    link: Link;
    onmove: (link: Link, direction: MoveDirection) => void;
    onedit: (link: Link) => void;
    onaddchild?: (parent: Link) => void;
}
export default class LinkListItem<CustomAttrs extends ILinkListItemAttrs = ILinkListItemAttrs> extends Component<CustomAttrs> {
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
    /**
     * A button rather than a decorative grip, so the list can also be rearranged
     * from the keyboard.
     */
    handle(): Mithril.Children;
    onhandlekeydown(e: KeyboardEvent): void;
    /**
     * Only what the address beside it does not already say.
     */
    flags(): ItemList<Mithril.Children>;
    flag(icon: string, label: Mithril.Children): Mithril.Children;
    audience(): Mithril.Children;
    controls(): ItemList<Mithril.Children>;
    /**
     * Tooltip replaces the `aria-label` of what it wraps with its own text, so
     * the tooltip carries the full label.
     */
    control(icon: string, label: Mithril.Children, onclick: () => void): Mithril.Children;
}
