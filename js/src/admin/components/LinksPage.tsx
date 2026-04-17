import app from 'flarum/admin/app';

import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import Placeholder from 'flarum/common/components/Placeholder';
import ItemList from 'flarum/common/utils/ItemList';
import sortable from 'sortablejs';
import type Mithril from 'mithril';

import sortLinks from '../../common/utils/sortLinks';
import type Link from '../../common/models/Link';

interface LinkOrder {
  id: string;
  children: string[];
}

function linkItem(link: Link): Mithril.Children {
  const icon = link.icon();

  return (
    <li data-id={link.id()}>
      <div className="LinkListItem-info">
        {icon && (
          <span className="LinkListItem-icon">
            <Icon name={icon} />{' '}
          </span>
        )}
        <span className="LinkListItem-name">{link.title()}</span>
        <Button className="Button Button--link" icon="fas fa-pencil-alt" onclick={() => app.modal.show(() => import('./EditLinkModal'), { link })} />
      </div>
      {!link.isChild() && (
        <ol className="LinkListItem-children LinkList">
          {sortLinks(app.store.all<Link>('links'))
            .filter((child) => child.parent() === link)
            .map(linkItem)}
        </ol>
      )}
    </li>
  );
}

export default class LinksPage extends ExtensionPage {
  forcedRefreshKey = 0;

  sections(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): ItemList<unknown> {
    const items = super.sections(vnode);

    items.setPriority('content', 100);
    items.add('links', this.links(), 80);

    return items;
  }

  links(): Mithril.Children {
    return (
      <div className="LinksPage">
        <div className="ExtensionPage-permissions-header">
          <div className="container">
            <h2 className="ExtensionTitle">{app.translator.trans('fof-links.admin.links.links')}</h2>
          </div>
        </div>
        {app.forum.attribute('links.set') ? this.linksPreset() : this.linksContent()}
      </div>
    );
  }

  linksPreset(): Mithril.Children {
    return <Placeholder text={app.translator.trans('fof-links.admin.links.preconfigured')} />;
  }

  linksContent(): Mithril.Children {
    return (
      <>
        <div className="container">
          <Button className="Button Button--primary" icon="fas fa-plus" onclick={() => app.modal.show(() => import('./EditLinkModal'))}>
            {app.translator.trans('fof-links.admin.links.create_button')}
          </Button>
        </div>
        <div className="LinksPage-list">
          <div className="container" key={this.forcedRefreshKey} oncreate={this.onListOnCreate.bind(this)}>
            <div className="LinkItems">
              <label>{app.translator.trans('fof-links.admin.links.links')}</label>
              <ol className="LinkList LinkList--primary">
                {sortLinks(app.store.all<Link>('links'))
                  .filter((link) => !link.isChild())
                  .map(linkItem)}
              </ol>
            </div>
          </div>
        </div>
      </>
    );
  }

  onListOnCreate(vnode: Mithril.VnodeDOM): void {
    vnode.dom.querySelectorAll<HTMLOListElement>('.LinkList').forEach((el) => {
      sortable.create(el, {
        group: 'links',
        animation: 150,
        swapThreshold: 0.65,
        dragClass: 'sortable-dragging',
        ghostClass: 'sortable-placeholder',
        onSort: () => this.onSortUpdate(),
      });
    });
  }

  onSortUpdate(): void {
    const root = this.element?.querySelector<HTMLOListElement>('.LinkList--primary');

    if (!root) return;

    const order: LinkOrder[] = Array.from(root.querySelectorAll<HTMLLIElement>(':scope > li')).map((el) => ({
      id: String(el.dataset.id),
      children: Array.from(el.querySelectorAll<HTMLLIElement>('li')).map((child) => String(child.dataset.id)),
    }));

    order.forEach((link, i) => {
      const parent = app.store.getById<Link>('links', link.id);

      if (!parent) return;

      parent.pushData({
        attributes: {
          position: i,
          isChild: false,
        },
        relationships: { parent: null },
      });

      link.children.forEach((childId, j) => {
        app.store.getById<Link>('links', childId)?.pushData({
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
