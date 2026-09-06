import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import Icon from 'flarum/common/components/Icon';
import classList from 'flarum/common/utils/classList';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';
import { isLinkActive, linkHref } from '../utils/linkTarget';

export interface ILinkItemAttrs extends ComponentAttrs {
  link: LinkModel;
  className?: string;
  inDropdown?: boolean;
  isDropdownButton?: boolean;
}

export default class LinkItem<CustomAttrs extends ILinkItemAttrs = ILinkItemAttrs> extends Component<CustomAttrs> {
  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    return this.isLabel ? this.labelView() : this.linkView();
  }

  labelView(): Mithril.Children {
    const className = classList(this.class, 'LinksButton--label');

    if (!this.attrs.isDropdownButton) {
      return (
        <span className={className}>
          {this.icon}
          {this.titleView}
        </span>
      );
    }

    return (
      <button type="button" className={className} aria-label={this.accessibleLabel} aria-haspopup="menu" data-toggle="dropdown">
        {this.icon}
        {this.titleView}
      </button>
    );
  }

  linkView(): Mithril.Children {
    const link = this.attrs.link;

    return (
      <Link
        className={this.class}
        href={this.linkHref}
        rel={this.rel}
        target={this.linkTarget}
        external={link.isNewtab() ? false : !link.isInternal()}
        aria-label={this.accessibleLabel}
        aria-current={this.isActive ? 'page' : undefined}
      >
        {this.icon}
        {this.titleView}
      </Link>
    );
  }

  get titleView(): Mithril.Children {
    const title = this.attrs.link.title();

    return (
      <span className="LinksButton-title" data-title={title}>
        {title}
      </span>
    );
  }

  get accessibleLabel(): string {
    return this.attrs.link.title();
  }

  get isLabel(): boolean {
    return this.attrs.link.isLabel();
  }

  get isActive(): boolean {
    return isLinkActive(this.attrs.link);
  }

  get linkHref(): string {
    return linkHref(this.attrs.link);
  }

  get icon(): Mithril.Children {
    const iconClass = this.attrs.link.icon();

    if (!iconClass) return null;

    return <Icon name={iconClass} className="Button-icon LinksButton-icon" />;
  }

  get rel(): string | undefined {
    const link = this.attrs.link;

    return classList(link.isNewtab() && 'noopener noreferrer', link.useRelMe() && 'me') || undefined;
  }

  get linkTarget(): string | undefined {
    const link = this.attrs.link;

    if (link.isInternal() && !link.isNewtab()) return undefined;

    return link.isNewtab() ? '_blank' : undefined;
  }

  get class(): string {
    const inDropdown = !!this.attrs.inDropdown;

    return classList('LinksButton', this.attrs.className, {
      Button: !inDropdown,
      'Button--link': !inDropdown,
      'LinksButton--inDropdown': inDropdown,
      // What core's own menu items are marked with. The phone menu indents a
      // row by it and hangs the icon in the space that makes.
      hasIcon: !!this.attrs.link.icon(),
      active: this.isActive,
    });
  }
}
