import app from 'flarum/admin/app';
import commonExtend from '../common/extend';
import Extend from 'flarum/common/extenders';
import LinksPage from './components/LinksPage';

export default [
  ...commonExtend,

  new Extend.Admin() //
    .page(LinksPage)
    .setting(() => ({
      setting: 'fof-links.show_icons_only_on_mobile',
      label: app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet'),
      type: 'boolean',
    })),
];
