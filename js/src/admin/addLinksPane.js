import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import LinksPage from './components/LinksPage';

export default function() {
    app.routes.links = { path: '/links', component: LinksPage };

    app.extensionSettings['fof-links'] = () => m.route.set(app.route('links'));

    extend(AdminNav.prototype, 'items', items => {
        items.add(
            'links',
            AdminLinkButton.component({
                href: app.route('links'),
                icon: 'fas fa-bars',
                description: app.translator.trans('fof-links.admin.nav.links_text'),
            }, app.translator.trans('fof-links.admin.nav.links_button'))
        );
    });
}
