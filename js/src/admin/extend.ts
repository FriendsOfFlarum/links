import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import extractText from 'flarum/common/utils/extractText';

import commonExtend from '../common/extend';
import LinksPage from './components/LinksPage';

export default [
  ...commonExtend,

  new Extend.Admin() //
    .page(LinksPage)
    .setting(() => ({
      setting: 'fof-links.show_icons_only_on_mobile',
      label: app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet'),
      help: app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet_help'),
      type: 'boolean',
    }))
    .generalIndexItems('settings', () => [
      {
        id: 'fof-links.show_icons_only_on_mobile',
        label: extractText(app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet')),
        help: extractText(app.translator.trans('fof-links.admin.settings.show_icons_only_on_tablet_help')),
      },
    ]),
];
