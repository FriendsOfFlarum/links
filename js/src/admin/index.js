import app from 'flarum/admin/app';
import LinksPage from './components/LinksPage';

export * from './components';
export * from '../common/utils';
export * from '../common/models';

export { default as extend } from './extend';

app.initializers.add('fof-links', () => {
  app.extensionData
    .for('fof-links')
    .registerPage(LinksPage)
    .registerSetting({
      setting: 'fof-links.show_icons_only_on_mobile',
      label: app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet'),
      type: 'boolean',
    });
});
