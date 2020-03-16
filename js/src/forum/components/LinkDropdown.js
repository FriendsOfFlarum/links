import SplitDropdown from 'flarum/components/SplitDropdown';
import ItemList from 'flarum/utils/ItemList';
import LinkItem from './LinkItem';
import icon from 'flarum/helpers/icon';
import sortLinks from '../../common/utils/sortLinks';

export default class LinkDropdown extends SplitDropdown {
    static initProps(props) {
        super.initProps(props);

        props.className += ' LinkDropdown';
        props.buttonClassName += ' Button--link';
    }

    view() {
        this.props.children = this.items().toArray();

        return super.view();
    }

    getButton() {
        // Make a copy of the props of the first child component. We will assign
        // these props to a new button, so that it has exactly the same behaviour as
        // the first child.
        const firstChild = this.getFirstChild();
        firstChild.props.className = (firstChild.props.className || '') + ' SplitDropdown-button Button ' + this.props.buttonClassName;

        return [
            firstChild,
            <button className={'Dropdown-toggle Button Button--icon ' + this.props.buttonClassName} data-toggle="dropdown">
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
        const parent = this.props.link;

        items.add(`link${parent.id()}`, LinkItem.component({ link: parent }));

        sortLinks(app.store.all('links'))
            .filter(link => link.parent() === parent)
            .forEach(child => items.add(`link${parent.id()}-${child.id()}`, LinkItem.component({ link: child, className: ' ' })));

        return items;
    }
}
