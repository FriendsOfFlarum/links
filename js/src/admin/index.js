import app from 'flarum/app';

import Link from '../common/models/Link';
import LinksPage from './components/LinksPage';

app.initializers.add('fof-links', () => {
    app.store.models.links = Link;

    app.extensionData.for('fof-links').registerPage(LinksPage);
});
