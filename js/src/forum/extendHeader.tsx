import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import HeaderPrimary from 'flarum/forum/components/HeaderPrimary';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

import type Link from '../common/models/Link';
import { hasChildren, rootLinks } from '../common/utils/linkHierarchy';
import LabelDropdown from './components/LabelDropdown';
import LinkDropdown from './components/LinkDropdown';
import LinkItem from './components/LinkItem';

export default function extendHeader() {
  extend(HeaderPrimary.prototype, 'items', function (items: ItemList<Mithril.Children>) {
    const allLinks = app.store.all<Link>('links');

    rootLinks(allLinks).forEach((link) => {
      const key = `link${link.id()}`;

      if (hasChildren(allLinks, link)) {
        items.add(key, link.isLabel() ? <LabelDropdown link={link} /> : <LinkDropdown link={link} />);
      } else if (!link.isLabel()) {
        // A label with nothing under it has nothing to show.
        items.add(key, <LinkItem link={link} />);
      }
    });
  });
}
