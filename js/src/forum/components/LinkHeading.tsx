import Component from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import classList from 'flarum/common/utils/classList';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';

export interface ILinkHeadingAttrs extends ComponentAttrs {
  link: LinkModel;
}

export default class LinkHeading<CustomAttrs extends ILinkHeadingAttrs = ILinkHeadingAttrs> extends Component<CustomAttrs> {
  static isListItem = true;

  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const link = this.attrs.link;
    const icon = link.icon();

    return (
      // The title is a bare text node: core styles a `span` that is a direct
      // child of a menu item as an item of its own, padding included.
      <li className={classList('Dropdown-header LinksHeading', { hasIcon: !!icon })} role="presentation">
        {icon && <Icon name={icon} className="LinksHeading-icon" />}
        {link.title()}
      </li>
    );
  }
}
