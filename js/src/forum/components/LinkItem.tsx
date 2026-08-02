/* global m*/

import app from 'flarum/forum/app';
import Link from 'flarum/common/components/Link';
import LinkModel from '../../common/models/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import Icon from 'flarum/common/components/Icon';
import Separator from 'flarum/common/components/Separator';
import classList from 'flarum/common/utils/classList';
import type { IButtonAttrs } from 'flarum/common/components/Button';
import type Mithril from 'mithril';
import Button from 'flarum/common/components/Button';

export interface ILinkItemAttrs extends IButtonAttrs {
  link: LinkModel;
  className?: string;
  inDropdown?: boolean;
  isDropdownButton?: boolean;
}

export default class LinkItem extends LinkButton {
  // Just definitions to satisfy TypeScript
  attrs!: ILinkItemAttrs;

  view(vnode: Mithril.Vnode<ILinkItemAttrs, never>): JSX.Element {
    if (this.isLabel) return this.labelView(vnode);

    return this.linkView(vnode);
  }

  labelView(vnode: Mithril.Vnode<ILinkItemAttrs, never>): JSX.Element {
    const link = this.attrs.link;
    const title = <span className="LinksButton-title">{link.title()}</span>;

    if (this.attrs.inDropdown) {
      return (
        <>
          <Separator />
          <span
            class={classList(this.class, 'LinksButton--label')}
            onclick={(e: MouseEvent) => {
              // don't close dropdown when clicking label
              e.stopPropagation();
            }}
          >
            {this.icon}
            {title}
          </span>
          <Separator />
        </>
      );
    }

    // Pass the icon to Button as an attr rather than a child: children are
    // wrapped in .Button-labelText, one level below where the button's flex
    // gap separates icon from label, so an icon passed as a child sits flush
    // against the title.
    return (
      <Button class={classList(this.class, 'LinksButton--label')} icon={this.icon} data-toggle={this.attrs.isDropdownButton ? 'dropdown' : undefined}>
        {title}
      </Button>
    );
  }

  linkView(vnode: Mithril.Vnode<ILinkItemAttrs, never>): JSX.Element {
    const link = this.attrs.link;

    const linkAttrs = {
      className: this.class,
      rel: this.rel,
      target: this.linkTarget,
      external: link.isNewtab() ? false : !link.isInternal(),
      href: this.linkHref,
    };

    return (
      <Link {...linkAttrs}>
        {this.icon}
        <span className="LinksButton-title">{link.title()}</span>
      </Link>
    );
  }

  get isInternal(): boolean {
    const link = this.attrs.link;

    return link.isInternal() && !link.isNewtab();
  }

  get isLabel(): boolean {
    return this.attrs.link.url().length === 0;
  }

  get linkHref(): string {
    const link = this.attrs.link;
    const url = link.url();

    if (url.startsWith('/') && link.isInternal()) {
      return app.forum.attribute('baseUrl') + url;
    }

    return url;
  }

  get icon(): Mithril.Child | null {
    const link = this.attrs.link;
    const iconClass = link.icon();

    if (iconClass) {
      return <Icon name={iconClass} className="Button-icon LinksButton-icon" />;
    }

    return null;
  }

  get rel(): string | undefined {
    // Prevent security risk on older browsers.
    // Modern browsers now have `noopener` by default and
    // require `opener` to enable `window.opener`.
    //
    // Learn more:
    // https://web.dev/external-anchors-use-rel-noopener

    return classList(this.attrs.link.isNewtab() && 'noopener noreferrer', this.attrs.link.useRelMe() && 'me') || undefined;
  }

  get class(): string {
    return classList('LinksButton', 'Button Button--link', this.attrs.className, {
      'LinksButton--inDropdown': this.attrs.inDropdown,
      active: this.isLinkCurrentPage,
    });
  }

  get isLinkCurrentPage(): boolean {
    const link = this.attrs.link;

    if (!link.isInternal()) return false;

    const base = app.forum.attribute<string>('baseUrl');

    // Mithril returns the current path relative to the origin, which isn't necessarily the base forum URL
    const currentUrl = new URL(m.route.get() || '/', base);
    const currentPath = currentUrl.href.replace(base, '');

    // The link from `this.linkHref` should already be absolute, but we'll make sure
    const linkUrl = new URL(this.linkHref, base);
    const linkPath = linkUrl.href.replace(base, '');

    // For exact match or root path
    if (currentPath === linkPath) return true;
    if (linkPath === '/') return false;

    // The link is active if the current path starts with the link path followed by a path boundary
    // This prevents false matches like '/t' matching '/tags'
    return currentPath.startsWith(linkPath) && /^[/?#]/.test(currentPath.charAt(linkPath.length));
  }

  get linkTarget(): string | undefined {
    const link = this.attrs.link;

    if (this.isInternal) return undefined;

    return link.isNewtab() ? '_blank' : undefined;
  }
}
