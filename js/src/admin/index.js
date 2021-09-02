import app from 'flarum/common/app';

import Link from '../common/models/Link';
import LinksPage from './components/LinksPage';

export * from './components';
export * from '../common/utils';
export * from '../common/models';

app.initializers.add('fof-links', () => {
  app.store.models.links = Link;

  app.extensionData.for('fof-links').registerPage(LinksPage);
});
