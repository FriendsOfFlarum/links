import app from 'flarum/forum/app';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

import type LinkModel from '../../common/models/Link';
import { childrenOf } from '../../common/utils/linkHierarchy';
import LinkHeading from '../components/LinkHeading';
import LinkItem from '../components/LinkItem';
import { isLinkActive } from './linkTarget';

export function containsActiveLink(parent: LinkModel): boolean {
  return isLinkActive(parent) || childrenOf(app.store.all<LinkModel>('links'), parent).some(isLinkActive);
}

function entry(link: LinkModel): Mithril.Children {
  return link.isLabel() ? <LinkHeading link={link} /> : <LinkItem link={link} inDropdown={true} />;
}

/**
 * A group's menu leads with the group itself. Core relies on that first entry:
 * a split dropdown hides it beside its own button, and the header's overflow
 * menu shows it as the title of the group.
 */
export function linkGroupItems(parent: LinkModel): ItemList<Mithril.Children> {
  const items = new ItemList<Mithril.Children>();

  items.add(`link${parent.id()}`, entry(parent), 100);

  childrenOf(app.store.all<LinkModel>('links'), parent).forEach((child, index) => {
    items.add(`link${parent.id()}-${child.id()}`, entry(child), -index);
  });

  return items;
}
