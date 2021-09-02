import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import { throttle } from 'flarum/common/utils/throttleDebounce';
import HeaderPrimary from 'flarum/forum/components/HeaderPrimary';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';

import Link from '../common/models/Link';
import LinkItem from './components/LinkItem';
import LinkDropdown from './components/LinkDropdown';
import sortLinks from '../common/utils/sortLinks';

import type ItemList from 'flarum/common/utils/ItemList';
import updateControlsWidth from './updateControlsWidth';

export * from './components';
export * from '../common/utils';
export * from '../common/models';

function test(this: HTMLDivElement, e: TransitionEvent) {
  if (e.propertyName === 'width') {
    console.log(e);

    const oldWidth = this.getBoundingClientRect().width;

    if (e.type === 'transitionstart' && e.elapsedTime === 0 && oldWidth < 300) {
      // going from small to large
      updateControlsWidth(oldWidth - 400);
    } else {
      updateControlsWidth();
    }
  }
}

app.initializers.add('fof-links', () => {
  app.store.models.links = Link;

  extend(HeaderSecondary.prototype, 'oncreate', function (this: HeaderPrimary) {
    this.$('.Search-input input')[0].addEventListener('transitionend', test);
    this.$('.Search-input input')[0].addEventListener('transitionstart', test);
  });

  extend(HeaderSecondary.prototype, 'onremove', function (this: HeaderPrimary) {
    this.$('.Search-input input')[0].removeEventListener('transitionend', test);
    this.$('.Search-input input')[0].removeEventListener('transitionstart', test);
  });

  extend(HeaderPrimary.prototype, ['oncreate', 'onupdate'], function (this: HeaderPrimary) {
    updateControlsWidth();
  });

  window.addEventListener('resize', throttle(50, updateControlsWidth), { passive: true });

  extend(HeaderPrimary.prototype, 'items', (items: ItemList) => {
    const links = app.store.all('links').filter((link) => !link.isChild());
    const addLink = (parent: Link) => {
      const hasChildren = !!app.store.all('links').filter((link) => link.parent() == parent).length;

      items.add(`link${parent.id()}`, hasChildren ? LinkDropdown.component({ link: parent }) : LinkItem.component({ link: parent }));
    };

    sortLinks(links).map(addLink);
  });
});
