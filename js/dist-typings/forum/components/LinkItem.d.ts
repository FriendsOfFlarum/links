import LinkModel from '../../common/models/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import type { IButtonAttrs } from 'flarum/common/components/Button';
import type Mithril from 'mithril';
export interface ILinkItemAttrs extends IButtonAttrs {
    link: LinkModel;
    className?: string;
    inDropdown?: boolean;
    isDropdownButton?: boolean;
}
export default class LinkItem extends LinkButton {
    attrs: ILinkItemAttrs;
    view(vnode: Mithril.Vnode<ILinkItemAttrs, never>): JSX.Element;
    labelView(vnode: Mithril.Vnode<ILinkItemAttrs, never>): JSX.Element;
    linkView(vnode: Mithril.Vnode<ILinkItemAttrs, never>): JSX.Element;
    get isInternal(): boolean;
    get isLabel(): boolean;
    get linkHref(): string;
    get icon(): Mithril.Child | null;
    get rel(): string | undefined;
    get class(): string;
    get isLinkCurrentPage(): boolean;
    get linkTarget(): string | undefined;
}
