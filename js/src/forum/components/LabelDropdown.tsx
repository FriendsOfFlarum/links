import app from 'flarum/forum/app';
import Dropdown, { IDropdownAttrs } from 'flarum/common/components/Dropdown';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';
import { containsActiveLink, linkGroupItems } from '../utils/linkGroup';

export interface ILabelDropdownAttrs extends IDropdownAttrs {
  link: LinkModel;
  className?: string;
}

/**
 * A group named by a label. The label goes nowhere on its own, so it is the
 * button that opens the menu.
 */
export default class LabelDropdown<CustomAttrs extends ILabelDropdownAttrs = ILabelDropdownAttrs> extends Dropdown<CustomAttrs> {
  static initAttrs(attrs: ILabelDropdownAttrs) {
    const link = attrs.link;
    const title = link.title();

    attrs.label = (
      <span className="LinksButton-title" data-title={title}>
        {title}
      </span>
    );
    attrs.icon = link.icon() || undefined;
    attrs.accessibleToggleLabel ||= extractText(app.translator.trans('fof-links.forum.header.toggle_dropdown_accessible_label', { title }));

    super.initAttrs(attrs);

    attrs.className = classList(attrs.className, 'LinkDropdown', { 'LinkDropdown--active': containsActiveLink(link) });
    attrs.buttonClassName = classList(attrs.buttonClassName, 'Button Button--link LinksButton', { hasIcon: !!attrs.icon });
    attrs.menuClassName = 'LinkDropdown-menu';
  }

  view(vnode: Mithril.Vnode<CustomAttrs, this>) {
    return super.view({ ...vnode, children: this.items().toArray() } as Mithril.Vnode<CustomAttrs, this>);
  }

  items(): ItemList<Mithril.Children> {
    return linkGroupItems(this.attrs.link);
  }
}
