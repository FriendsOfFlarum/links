/* global m*/

import app from 'flarum/common/app';
import Link from 'flarum/common/components/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import icon from 'flarum/common/helpers/icon';

export default class LinkItem extends LinkButton {
  view() {
    const link = this.attrs.link;
    const iconName = link.icon();
    let className = `LinksButton ${this.attrs.className || 'Button Button--link'}`;
    let rel = null;

    if (link.isInternal()) {
      const currentPath = m.route.get() || '/';
      let linkPath = link.url().replace(app.forum.attribute('baseUrl'), '');

      if (linkPath === '') linkPath = '/';

      // The link is active if the current path starts with the link path.
      // Except if it's the base url, in which case only an exact match is considered active
      if (currentPath.indexOf(linkPath) === 0 && (currentPath === '/' || linkPath !== '/')) {
        className += ' active';
      }
    } else {
      // Prevent security risk on older browsers.
      // Modern browsers now have `noopener` by default and
      // require `opener` to enable `window.opener`.
      //
      // Learn more:
      // https://web.dev/external-anchors-use-rel-noopener
      // https://mathiasbynens.github.io/rel-noopener/
      rel = link.isNewtab() ? 'noopener noreferrer' : null;
    }

    const linkAttrs = {
      className,
      rel,
      target: link.isNewtab() ? '_blank' : '',
      title: link.title(),
      external: !link.isInternal(),
      href: link.url(),
      "aria-label": link.title(),
    };

    return (
      <Link {...linkAttrs}>
        {iconName ? icon(iconName, { className: 'Button-icon' }) : ''}
        {link.title()}
      </Link>
    );
  }
}
