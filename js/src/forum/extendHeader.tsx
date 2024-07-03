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
    const links = app.store.all<Link>('links').filter((link) => !link.isChild());
    const addLink = (parent: Link | null | undefined) => {
      const hasChildren = app.store.all<Link>('links').some((link) => link.parent() == parent);

      items.add(`link${parent?.id()}`, hasChildren ? LinkDropdown.component({ link: parent }) : LinkItem.component({ link: parent }));
    };

    sortLinks(links).map(addLink);
  });
}
