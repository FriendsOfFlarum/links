/* global m*/

import app from 'flarum/common/app';
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

  view(vnode: Mithril.Vnode<ILinkItemAttrs, never>): Mithril.Children {
    if (this.isLabel) return this.labelView(vnode);

    return this.linkView(vnode);
  }

  labelView(vnode: Mithril.Vnode<ILinkItemAttrs, never>): Mithril.Children {
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
          {this.icon} {link.title()}
        </LinkLabelNode>
        {this.attrs.inDropdown && <Separator />}
      </>
    );
  }

  linkView(vnode: Mithril.Vnode<ILinkItemAttrs, never>): Mithril.Children {
    const link = this.attrs.link;

    const linkAttrs = {
      className: this.class,
      rel: this.rel,
      target: this.linkTarget,
      external: !link.isInternal(),
      href: link.url(),
    };

    return (
      <Link {...linkAttrs}>
        {this.icon} {link.title()}
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

  get icon(): Mithril.Child | null {
    const link = this.attrs.link;
    const iconClass = link.icon();

    if (iconClass) {
      return icon(iconClass, { className: 'Button-icon' });
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

    return this.attrs.link.isNewtab() ? 'noopener noreferrer' : undefined;
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

    const currentPath = m.route.get() || '/';

    let linkPath = link.url().replace(app.forum.attribute('baseUrl'), '');
    if (linkPath === '') linkPath = '/';

    // The link is active if the current path starts with the link path.
    // Except if it's the base url, in which case only an exact match is considered active
    return currentPath.indexOf(linkPath) === 0 && (currentPath === '/' || linkPath !== '/');
  }

  get linkTarget(): string | undefined {
    const link = this.attrs.link;

    if (link.isInternal()) return undefined;

    return link.isNewtab() ? '_blank' : undefined;
  }
}
