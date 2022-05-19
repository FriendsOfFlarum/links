import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import HeaderPrimary from 'flarum/common/components/HeaderPrimary';

import Link from '../common/models/Link';
import LinkItem from './components/LinkItem';
import LinkDropdown from './components/LinkDropdown';
import sortLinks from '../common/utils/sortLinks';

export * from './components';
export * from '../common/utils';
export * from '../common/models';

app.initializers.add('fof-links', () => {
  app.store.models.links = Link;

  extend(HeaderPrimary.prototype, 'items', (items) => {
    const links = app.store.all('links').filter((link) => !link.isChild());
    const addLink = (parent) => {
      const hasChildren = app.store.all('links').some((link) => link.parent() == parent);

      items.add(`link${parent.id()}`, hasChildren ? LinkDropdown.component({ link: parent }) : LinkItem.component({ link: parent }));
    };

    sortLinks(links).map(addLink);
  });
});
