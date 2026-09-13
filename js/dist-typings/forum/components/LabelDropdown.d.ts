import Dropdown, { IDropdownAttrs } from 'flarum/common/components/Dropdown';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type LinkModel from '../../common/models/Link';
export interface ILabelDropdownAttrs extends IDropdownAttrs {
    link: LinkModel;
    className?: string;
}
/**
 * A group named by a label. The label goes nowhere on its own, so it is the
 * button that opens the menu.
 */
export default class LabelDropdown<CustomAttrs extends ILabelDropdownAttrs = ILabelDropdownAttrs> extends Dropdown<CustomAttrs> {
    static initAttrs(attrs: ILabelDropdownAttrs): void;
    view(vnode: Mithril.Vnode<CustomAttrs, this>): JSX.Element;
    items(): ItemList<Mithril.Children>;
}
