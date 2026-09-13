import Component from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import classList from 'flarum/common/utils/classList';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';
import { isLinkActive, linkHref } from '../utils/linkTarget';

export interface ILinkItemAttrs extends ComponentAttrs {
  link: LinkModel;
  className?: string;
  /** Rendered as a menu entry rather than as a header button. */
  inDropdown?: boolean;
}

export default class LinkItem<CustomAttrs extends ILinkItemAttrs = ILinkItemAttrs> extends Component<CustomAttrs> {
  /**
   * Read by `listItems`, which marks the `<li>` around an active item. Core
   * highlights an active menu entry from there.
   */
  static isActive(attrs: ILinkItemAttrs): boolean {
    return isLinkActive(attrs.link);
  }

  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const link = this.attrs.link;
    const title = link.title();
    const active = isLinkActive(link);

    return (
      <LinkButton
        className={classList('LinksButton', this.attrs.className, !this.attrs.inDropdown && 'Button Button--link')}
        href={linkHref(link)}
        external={!link.isNewtab() && !link.isInternal()}
        target={link.isNewtab() ? '_blank' : undefined}
        rel={this.rel()}
        icon={link.icon() || undefined}
        active={active}
        aria-current={active ? 'page' : undefined}
        // Kept for when the title is hidden to leave only the icon.
        aria-label={title}
      >
        <span className="LinksButton-title" data-title={title}>
          {title}
        </span>
      </LinkButton>
    );
  }

  rel(): string | undefined {
    const link = this.attrs.link;

    return classList(link.isNewtab() && 'noopener noreferrer', link.useRelMe() && 'me') || undefined;
  }
}
