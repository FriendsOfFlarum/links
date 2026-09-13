import app from 'flarum/forum/app';
import SplitDropdown, { ISplitDropdownAttrs } from 'flarum/common/components/SplitDropdown';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';
import { containsActiveLink, linkGroupItems } from '../utils/linkGroup';
import LinkItem from './LinkItem';

export interface ILinkDropdownAttrs extends ISplitDropdownAttrs {
  link: LinkModel;
  className?: string;
}

/**
 * A group led by a link. The link stays one click away, beside the caret that
 * opens the links under it.
 */
export default class LinkDropdown<CustomAttrs extends ILinkDropdownAttrs = ILinkDropdownAttrs> extends SplitDropdown<CustomAttrs> {
  static initAttrs(attrs: ILinkDropdownAttrs) {
    attrs.accessibleToggleLabel ||= extractText(
      app.translator.trans('fof-links.forum.header.toggle_dropdown_accessible_label', { title: attrs.link.title() })
    );

    super.initAttrs(attrs);

    attrs.className = classList(attrs.className, 'LinkDropdown', { 'LinkDropdown--active': containsActiveLink(attrs.link) });
    attrs.buttonClassName = classList(attrs.buttonClassName, 'Button--link');

    // Navigation starts at the left of the header, so the menu opens from the
    // left edge rather than core's right. Dropdown still flips it near the edge.
    attrs.menuClassName = 'LinkDropdown-menu';
  }

  view(vnode: Mithril.Vnode<CustomAttrs, this>) {
    return super.view({ ...vnode, children: this.items().toArray() } as Mithril.Vnode<CustomAttrs, this>);
  }

  /**
   * Core copies the first menu entry onto a `<button>`, which cannot carry a
   * link, so the group's link is rendered as itself.
   */
  getButton(): Mithril.Vnode<any, any> {
    return (
      <>
        <LinkItem link={this.attrs.link} className={classList('SplitDropdown-button', this.attrs.buttonClassName)} />
        <Button
          className={classList('Dropdown-toggle Button Button--icon', this.attrs.buttonClassName)}
          icon={<Icon name="fas fa-caret-down" className="Button-caret" />}
          aria-haspopup="menu"
          aria-label={this.attrs.accessibleToggleLabel}
          data-toggle="dropdown"
        />
      </>
    ) as unknown as Mithril.Vnode<any, any>;
  }

  items(): ItemList<Mithril.Children> {
    return linkGroupItems(this.attrs.link);
  }
}
