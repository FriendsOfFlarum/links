import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';

import sortable from 'sortablejs';

import EditLinkModal from './EditLinkModal';
import sortLinks from '../../common/utils/sortLinks';

function linkItem(link) {
    return (
        <li data-id={link.id()}>
            <div className="LinkListItem-info">
                <span className="LinkListItem-name">{link.title()}</span>
                {Button.component({
                    className: 'Button Button--link',
                    icon: 'fas fa-pencil-alt',
                    onclick: () => app.modal.show(EditLinkModal, { link }),
                })}
            </div>

            {!link.isChild() && (
                <ol className="LinkListItem-children LinkList">
                    {sortLinks(app.store.all('links'))
                        .filter(child => child.parent() === link)
                        .map(linkItem)}
                </ol>
            )}
        </li>
    );
}

export default class LinksPage extends Page {
    oninit(vnode) {
        super.oninit(vnode);

        this.forcedRefreshKey = 0;
    }

    view() {
        return (
            <div className="LinksPage">
                <div className="LinksPage-header">
                    <div className="container">
                        <p>{app.translator.trans('fof-links.admin.links.about_text')}</p>
                        {Button.component({
                            className: 'Button Button--primary',
                            icon: 'fas fa-plus',
                            onclick: () => app.modal.show(EditLinkModal),
                        }, app.translator.trans('fof-links.admin.links.create_button'))}
                    </div>
                </div>
                <div className="LinksPage-list">
                    <div className="container" key={this.forcedRefreshKey} oncreate={this.onListOnCreate.bind(this)}>
                        <div className="LinkItems">
                            <label>{app.translator.trans('fof-links.admin.links.links')}</label>
                            <ol className="LinkList LinkList--primary">
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

    onListOnCreate(vnode) {
        this.$('.LinkList').get().map(e => {
            sortable.create(e, {
                group: 'links',
                animation: 150,
                swapThreshold: 0.65,
                dragClass: 'sortable-dragging',
                ghostClass: 'sortable-placeholder',
                onSort: (e) => this.onSortUpdate(e)
            })
        });
    }

    onSortUpdate(e) {
        console.log("hi")
        const order = this.$('.LinkList--primary > li')
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
            body: { order },
        });

        this.forcedRefreshKey++;
        m.redraw();
    }
}
