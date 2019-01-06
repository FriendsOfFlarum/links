import { extend, override } from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';

import Link from '../common/models/Link';
import LinkItem from './components/LinkItem';
import sortLinks from '../common/utils/sortLinks';

app.initializers.add('fof-links', () => {
    app.store.models.links = Link;

    extend(HeaderPrimary.prototype, 'items', items => {
        const links = app.store.all('links');
        const addLink = link => items.add(`link${link.id()}`, LinkItem.component({ link }));

        sortLinks(links).map(addLink);
    });
});
