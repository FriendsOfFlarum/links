import { extend } from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';

import Link from '../common/models/Link';
import LinkItem from './components/LinkItem';
import LinkDropdown from './components/LinkDropdown';
import sortLinks from '../common/utils/sortLinks';

app.initializers.add('fof-links', () => {
    app.store.models.links = Link;

    extend(HeaderPrimary.prototype, 'items', items => {
        const links = app.store.all('links').filter(link => !link.isChild());
        const addLink = parent => {
            const hasChildren = !!app.store.all('links').filter(link => link.parent() == parent).length;

            items.add(`link${parent.id()}`, hasChildren ? LinkDropdown.component({ link: parent }) : LinkItem.component({ link: parent }));
        };

        sortLinks(links).map(addLink);
    });
});
