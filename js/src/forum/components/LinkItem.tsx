/* global m*/

import app from 'flarum/forum/app';
import Link from 'flarum/common/components/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import icon from 'flarum/common/helpers/icon';
import Separator from 'flarum/common/components/Separator';

import classList from 'flarum/common/utils/classList';

import type { IButtonAttrs } from 'flarum/common/components/Button';
import type Mithril from 'mithril';
import Button from 'flarum/common/components/Button';

interface ILink {
  isInternal(): boolean;
  url(): string;
  title(): string;
  icon(): string;
  isNewtab(): boolean;
  useRelMe(): boolean;
}

interface ILinkItemAttrs extends IButtonAttrs {
  link: ILink;
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

    const LinkLabelNode = this.attrs.inDropdown ? 'span' : Button;

    return (
      <>
        {this.attrs.inDropdown && <Separator />}
        <LinkLabelNode
          class={classList(this.class, 'LinksButton--label')}
          onclick={(e: MouseEvent) => {
            if (this.attrs.inDropdown) {
              // don't close dropdown when clicking label
              e.stopPropagation();
            }
          }}
          data-toggle={this.attrs.isDropdownButton ? 'dropdown' : undefined}
        >
          {this.icon}
          <span className="LinksButton-title">{link.title()}</span>
        </LinkLabelNode>
        {this.attrs.inDropdown && <Separator />}
      </>
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
      return icon(iconClass, { className: 'Button-icon LinksButton-icon' });
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
    return classList('LinksButton', this.attrs.className || 'Button Button--link', {
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

    // The link is active if the current path starts with the link path.
    // Except if it's the base url, in which case only an exact match is considered active
    return currentPath.indexOf(linkPath) === 0 && (currentPath === '/' || linkPath !== '/');
  }

  get linkTarget(): string | undefined {
    const link = this.attrs.link;

    if (this.isInternal) return undefined;

    return link.isNewtab() ? '_blank' : undefined;
  }
}
