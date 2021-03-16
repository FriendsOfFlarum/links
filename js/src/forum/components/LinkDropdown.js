import SplitDropdown from 'flarum/common/components/SplitDropdown';
import ItemList from 'flarum/common/utils/ItemList';
import LinkItem from './LinkItem';
import icon from 'flarum/common/helpers/icon';
import sortLinks from '../../common/utils/sortLinks';

export default class LinkDropdown extends SplitDropdown {
    static initAttrs(attrs) {
        super.initAttrs(attrs);

        attrs.className += ' LinkDropdown';
        attrs.buttonClassName += ' Button--link';
    }

    view(vnode) {
        const children = this.items().toArray();

        return super.view({ ...vnode, children });
    }

    getButton(children) {
        // Make a copy of the attrs of the first child component. We will assign
        // these attrs to a new button, so that it has exactly the same behaviour as
        // the first child.
        const firstChild = this.getFirstChild(children);
        firstChild.attrs.className = (firstChild.attrs.className || '') + ' SplitDropdown-button Button ' + this.attrs.buttonClassName;

        return [
            firstChild,
            <button className={'Dropdown-toggle Button Button--icon ' + this.attrs.buttonClassName} data-toggle="dropdown">
                {icon('fas fa-caret-down', { className: 'Button-caret' })}
            </button>,
        ];
    }

    /**
     * Build an item list for the contents of the dropdown menu.
     *
     * @return {ItemList}
     */
    items() {
        const items = new ItemList();
        const parent = this.attrs.link;

        items.add(`link${parent.id()}`, LinkItem.component({ link: parent }));

        sortLinks(app.store.all('links'))
            .filter((link) => link.parent() === parent)
            .forEach((child) => items.add(`link${parent.id()}-${child.id()}`, LinkItem.component({ link: child, className: ' ' })));

        return items;
    }
}
