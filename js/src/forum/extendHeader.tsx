import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import HeaderPrimary from 'flarum/forum/components/HeaderPrimary';
import ItemList from 'flarum/common/utils/ItemList';
import sortLinks from '../common/utils/sortLinks';
import type Mithril from 'mithril';
import Link from '../common/models/Link';
import LinkItem from './components/LinkItem';
import LinkDropdown from './components/LinkDropdown';

export default function extendHeader() {
  extend(HeaderPrimary.prototype, 'items', function (items: ItemList<Mithril.Children>) {
    const allLinks = app.store.all<Link>('links');
    const links = allLinks.filter((link) => !link.isChild());
    const addLink = (parent: Link | null | undefined) => {
      const hasChildren = allLinks.some((link) => link.parent() == parent);

      items.add(`link${parent?.id()}`, hasChildren ? LinkDropdown.component({ link: parent }) : LinkItem.component({ link: parent }));
    };

    sortLinks(links).map(addLink);
  });
}
