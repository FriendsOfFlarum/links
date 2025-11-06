export default class LinkDropdown extends SplitDropdown<import("flarum/common/components/SplitDropdown").ISplitDropdownAttrs> {
    static initAttrs(attrs: any): void;
    constructor();
    view(vnode: any): JSX.Element;
    getButton(children: any): any[];
    /**
     * Build an item list for the contents of the dropdown menu.
     *
     * @return {ItemList}
     */
    items(): ItemList<any>;
}
import SplitDropdown from "flarum/common/components/SplitDropdown";
import ItemList from "flarum/common/utils/ItemList";
