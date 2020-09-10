import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import icon from 'flarum/helpers/icon';

import sortable from 'html5sortable/dist/html5sortable.es.js';

import EditLinkModal from './EditLinkModal';
import sortLinks from '../../common/utils/sortLinks';

function linkItem(link) {
    return (
        <li data-id={link.id()}>
            <div className="LinkListItem-info">
                {link.icon() ? <span className="LinkListItem-icon">{icon(link.icon())} </span> : ''}
                <span className="LinkListItem-name">{link.title()}</span>
                {Button.component({
                    className: 'Button Button--link',
                    icon: 'fas fa-pencil-alt',
                    onclick: () => app.modal.show(new EditLinkModal({ link })),
                })}
            </div>

            {!link.isChild() && (
                <ol className="LinkListItem-children">
                    {sortLinks(app.store.all('links'))
                        .filter(child => child.parent() === link)
                        .map(linkItem)}
                </ol>
            )}
        </li>
    );
}

export default class LinksPage extends Page {
    view() {
        return (
            <div className="LinksPage">
                <div className="LinksPage-header">
                    <div className="container">
                        <p>{app.translator.trans('fof-links.admin.links.about_text')}</p>
                        {Button.component({
                            className: 'Button Button--primary',
                            icon: 'fas fa-plus',
                            children: app.translator.trans('fof-links.admin.links.create_button'),
                            onclick: () => app.modal.show(new EditLinkModal()),
                        })}
                    </div>
                </div>
                <div className="LinksPage-list">
                    <div className="container">
                        <div className="LinkItems">
                            <label>{app.translator.trans('fof-links.admin.links.links')}</label>
                            <ol className="LinkList">
                                {sortLinks(app.store.all('links'))
                                    .filter(link => !link.isChild())
                                    .map(linkItem)}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    config() {
        sortable(this.$('ol, ul'), {
            acceptFrom: 'ol,ul',
        }).forEach(el =>
            el.addEventListener('sortupdate', () => {
                const order = this.$('.LinkList > li')
                    .map((i, el) => ({
                        id: $(el).data('id'),
                        children: $(el)
                            .find('li')
                            .map((i, el) => $(el).data('id'))
                            .get(),
                    }))
                    .get();

                order.forEach((link, i) => {
                    const parent = app.store.getById('links', link.id);

                    parent.pushData({
                        attributes: {
                            position: i,
                            isChild: false,
                        },
                        relationships: { parent: null },
                    });

                    link.children.forEach((child, j) => {
                        app.store.getById('links', child).pushData({
                            attributes: {
                                position: j,
                                isChild: true,
                            },
                            relationships: { parent },
                        });
                    });
                });

                app.request({
                    url: `${app.forum.attribute('apiUrl')}/links/order`,
                    method: 'POST',
                    data: { order },
                });

                m.redraw.strategy('all');
                m.redraw();
            })
        );
    }
}
