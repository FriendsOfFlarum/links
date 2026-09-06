import app from 'flarum/forum/app';

import type Link from '../../common/models/Link';

export function linkHref(link: Link): string {
  const url = link.url();

  if (url.startsWith('/') && link.isInternal()) {
    return app.forum.attribute<string>('baseUrl') + url;
  }

  return url;
}

export function isLinkActive(link: Link): boolean {
  if (!link.isInternal() || link.isLabel()) return false;

  const base = app.forum.attribute<string>('baseUrl');

  const currentUrl = new URL(m.route.get() || '/', base);
  const currentPath = currentUrl.href.replace(base, '');

  const linkUrl = new URL(linkHref(link), base);
  const linkPath = linkUrl.href.replace(base, '');

  if (currentPath === linkPath) return true;
  if (linkPath === '/') return false;

  return currentPath.startsWith(linkPath) && /^[/?#]/.test(currentPath.charAt(linkPath.length));
}
