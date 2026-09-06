import app from 'flarum/forum/app';
import SplitDropdown, { ISplitDropdownAttrs } from 'flarum/common/components/SplitDropdown';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';
import { childrenOf } from '../../common/utils/linkHierarchy';
import { isLinkActive } from '../utils/linkTarget';
import LinkHeading from './LinkHeading';
import LinkItem from './LinkItem';

export interface ILinkDropdownAttrs extends ISplitDropdownAttrs {
  link: LinkModel;
  className?: string;
}

export default class LinkDropdown<CustomAttrs extends ILinkDropdownAttrs = ILinkDropdownAttrs> extends SplitDropdown<CustomAttrs> {
  static initAttrs(attrs: ILinkDropdownAttrs) {
    attrs.accessibleToggleLabel ||= extractText(
      app.translator.trans('fof-links.forum.header.toggle_dropdown_accessible_label', { title: attrs.link.title() })
    );

    super.initAttrs(attrs);

    attrs.className = classList(attrs.className, 'LinkDropdown', {
      'LinkDropdown--active': LinkDropdown.containsActiveLink(attrs.link),
      // Core hides the first menu entry wherever the main button is shown
      // beside the caret, on the assumption the two are the same link. That
      // only holds when the group's own link leads the menu, which it does not
      // when the group is named by a label.
      'Dropdown--withMainAction': attrs.link.isLabel(),
    });
    attrs.buttonClassName = classList(attrs.buttonClassName, 'Button--link');

    attrs.menuClassName = 'LinkDropdown-menu';
  }

  /**
   * Named away from `isActive`, which `listItems` calls on a component's class
   * with the item's attrs to decide whether to mark its `<li>` active.
   */
  static containsActiveLink(link: LinkModel): boolean {
    if (isLinkActive(link)) return true;

    return childrenOf(app.store.all<LinkModel>('links'), link).some(isLinkActive);
  }

  view(vnode: Mithril.Vnode<CustomAttrs, this>) {
    return super.view({ ...vnode, children: this.items().toArray() } as Mithril.Vnode<CustomAttrs, this>);
  }

  getButton(): Mithril.Vnode<any, any> {
    const link = this.attrs.link;

    return (
      <>
        <LinkItem link={link} isDropdownButton={true} className={classList('SplitDropdown-button', this.attrs.buttonClassName)} />
        <button
          type="button"
          className={classList('Dropdown-toggle Button Button--icon', this.attrs.buttonClassName)}
          aria-haspopup="menu"
          aria-label={this.attrs.accessibleToggleLabel}
          data-toggle="dropdown"
        >
          <Icon name="fas fa-caret-down" className="Button-caret" />
        </button>
      </>
    ) as unknown as Mithril.Vnode<any, any>;
  }

  /**
   * A group whose own link goes somewhere leads the menu with it, so it stays
   * reachable where the menu is the whole control — the drawer, and the
   * header's overflow menu. A group named by a label has nowhere to lead to,
   * and the control that opened the menu is already showing that name.
   */
  items(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const parent = this.attrs.link;

    if (!parent.isLabel()) {
      items.add(`link${parent.id()}`, <LinkItem link={parent} inDropdown={true} />, 100);
    }

    childrenOf(app.store.all<LinkModel>('links'), parent).forEach((child, index) => {
      items.add(
        `link${parent.id()}-${child.id()}`,
        child.isLabel() ? <LinkHeading link={child} /> : <LinkItem link={child} inDropdown={true} />,
        -index
      );
    });

    return items;
  }
}
