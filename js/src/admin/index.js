import app from 'flarum/admin/app';

import Link from '../common/models/Link';
import LinksPage from './components/LinksPage';

export * from './components';
export * from '../common/utils';
export * from '../common/models';

app.initializers.add('fof-links', () => {
  app.store.models.links = Link;

  app.extensionData
    .for('fof-links')
    .registerPage(LinksPage)
    .registerSetting({
      setting: 'fof-links.show_icons_only_on_mobile',
      label: app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet'),
      type: 'boolean',
    });
});
