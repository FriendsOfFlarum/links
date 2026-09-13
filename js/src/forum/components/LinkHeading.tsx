import Component from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';

export interface ILinkHeadingAttrs extends ComponentAttrs {
  link: LinkModel;
}

/**
 * A label inside a menu, shown as core's menu heading.
 */
export default class LinkHeading<CustomAttrs extends ILinkHeadingAttrs = ILinkHeadingAttrs> extends Component<CustomAttrs> {
  /** Renders its own `<li>`, so `listItems` does not wrap it in another. */
  static isListItem = true;

  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const link = this.attrs.link;
    const icon = link.icon();

    // The title stays a bare text node: core styles a `span` directly inside a
    // menu item as a clickable entry.
    return (
      <li className="Dropdown-header LinksHeading" role="presentation">
        {!!icon && <Icon name={icon} />} {link.title()}
      </li>
    );
  }
}
