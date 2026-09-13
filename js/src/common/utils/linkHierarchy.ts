import sortLinks from './sortLinks';
import type Link from '../models/Link';

export function rootLinks(links: Link[]): Link[] {
  return sortLinks(links.filter((link) => !link.isChild()));
}

export function childrenOf(links: Link[], parent: Link): Link[] {
  return sortLinks(links.filter((link) => link.parent() === parent));
}

export function hasChildren(links: Link[], parent: Link): boolean {
  return links.some((link) => link.parent() === parent);
}
