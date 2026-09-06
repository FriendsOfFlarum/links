import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import FieldSet from 'flarum/common/components/FieldSet';
import Form from 'flarum/common/components/Form';
import InfoTile from 'flarum/common/components/InfoTile';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

import type Link from '../../common/models/Link';
import { childrenOf, rootLinks } from '../../common/utils/linkHierarchy';
import { buildOrder, describePosition, moveLink, orderFromDom, type LinkOrderEntry, type MoveDirection } from '../utils/linkOrder';
import LinkListItem from './LinkListItem';

type SortableStatic = typeof import('sortablejs');
type SortableInstance = InstanceType<SortableStatic>;

export default class LinksPage<CustomAttrs extends ExtensionPageAttrs = ExtensionPageAttrs> extends ExtensionPage<CustomAttrs> {
  /**
   * Dragging rearranges the DOM behind Mithril's back. Changing the key
   * rebuilds the list outright rather than diffing against a tree it did not
   * write.
   */
  forcedRefreshKey = 0;

  sortable: SortableStatic | null = null;

  sortableInstances: SortableInstance[] = [];

  announcement: Mithril.Children = '';

  refocusId: string | null = null;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    if (this.isOverridden()) return;

    // Core ships sortable as its own chunk, so reusing it costs nothing extra.
    import('flarum/admin/utils/loadSortable').then((module) => {
      this.sortable = module.default;
      this.forcedRefreshKey++;
      m.redraw();
    });
  }

  onremove(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.onremove(vnode);

    this.destroySortables();
  }

  isOverridden(): boolean {
    return !!app.forum.attribute('links.set');
  }

  /**
   * Both sections of the page in one column, the way core lays out an
   * extension page's settings.
   */
  content(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    return (
      <div className="ExtensionPage-settings">
        <div className="container">
          <Form>
            <FieldSet
              label={extractText(app.translator.trans('fof-links.admin.links.links'))}
              description={extractText(app.translator.trans('fof-links.admin.links.description'))}
            >
              {this.isOverridden() ? this.overriddenNotice() : this.list()}
            </FieldSet>
          </Form>
          {this.settingsForm()}
        </div>
      </div>
    );
  }

  /**
   * Core's own settings form, given a heading of its own so it does not read as
   * part of the list above it.
   */
  settingsForm(): Mithril.Children {
    const settings = app.registry.getSettings(this.extension.id);

    if (!settings) return null;

    return (
      <Form>
        <FieldSet label={extractText(app.translator.trans('fof-links.admin.settings.heading'))}>
          {settings.map(this.buildSettingComponent.bind(this))}
          <div className="Form-group Form-controls">
            {this.submitButton()}
            {this.resetButton(
              settings
                .filter((entry): entry is Exclude<typeof entry, () => Mithril.Children> => typeof entry !== 'function')
                .map((entry) => ({ key: entry.setting, label: entry.label })),
              app.translator.trans(
                'core.admin.extension.reset_settings.title_extension',
                { extensionTitle: this.extension.extra['flarum-extension'].title },
                true
              ),
              this.extension.id
            )}
          </div>
        </FieldSet>
      </Form>
    );
  }

  overriddenNotice(): Mithril.Children {
    return (
      <InfoTile icon="fas fa-file-code" type="warning">
        {app.translator.trans('fof-links.admin.links.preconfigured')}
      </InfoTile>
    );
  }

  list(): Mithril.Children {
    const links = app.store.all<Link>('links');
    const roots = rootLinks(links);

    return (
      <>
        {roots.length > 0 && (
          <div className="LinksPage-list">
            <div key={this.forcedRefreshKey} oncreate={this.onListCreate.bind(this)} onremove={this.destroySortables.bind(this)}>
              <ol className="LinkList LinkList--root">{roots.map((link) => this.item(link, links))}</ol>
            </div>
          </div>
        )}
        {links.length > 1 && (
          <p className="helpText" id="fof-links-reorder-help">
            {this.sortable ? (
              app.translator.trans('fof-links.admin.links.reorder_help')
            ) : (
              <>
                <LoadingIndicator display="inline" size="small" /> {app.translator.trans('fof-links.admin.links.reorder_loading')}
              </>
            )}
          </p>
        )}
        <div className="Form-group Form-controls">
          <Button className="Button Button--dashed" icon="fas fa-plus" onclick={() => this.edit()}>
            {app.translator.trans('fof-links.admin.links.create_button')}
          </Button>
        </div>
        <div className="sr-only" role="status" aria-live="polite">
          {this.announcement}
        </div>
      </>
    );
  }

  item(link: Link, links: Link[]): Mithril.Children {
    const isRoot = !link.isChild();

    return (
      <LinkListItem
        key={link.id()}
        link={link}
        onmove={this.move.bind(this)}
        onedit={this.edit.bind(this)}
        onaddchild={isRoot ? this.addChild.bind(this) : undefined}
      >
        {isRoot && (
          // Always rendered: it is where a link is dropped to nest it.
          <ol className="LinkList LinkListItem-children">{childrenOf(links, link).map((child) => this.item(child, links))}</ol>
        )}
      </LinkListItem>
    );
  }

  edit(link?: Link): void {
    app.modal.show(() => import('./EditLinkModal'), { link });
  }

  addChild(parent: Link): void {
    app.modal.show(() => import('./EditLinkModal'), { parent });
  }

  onListCreate(vnode: Mithril.VnodeDOM): void {
    this.destroySortables();

    if (!this.sortable) return;

    vnode.dom.querySelectorAll<HTMLElement>('.LinkList').forEach((el) => {
      this.sortableInstances.push(
        this.sortable!.create(el, {
          group: {
            name: 'links',
            // Only two levels exist, so a link that already has links under it
            // cannot go inside another one.
            put: (to, _from, dragged) => !(to.el.classList.contains('LinkListItem-children') && !!dragged.querySelector('li')),
          },
          handle: '.LinkListItem-handle',
          delay: 50,
          delayOnTouchOnly: true,
          touchStartThreshold: 5,
          animation: 150,
          swapThreshold: 0.65,
          dragClass: 'sortable-dragging',
          ghostClass: 'sortable-placeholder',
          onSort: () => this.onSortUpdate(),
        })
      );
    });
  }

  destroySortables(): void {
    this.sortableInstances.forEach((instance) => instance.destroy());
    this.sortableInstances = [];
  }

  onSortUpdate(): void {
    const root = this.element?.querySelector('.LinkList--root');

    if (!root) return;

    this.persist(orderFromDom(root));
  }

  move(link: Link, direction: MoveDirection): void {
    const id = String(link.id());
    const order = moveLink(buildOrder(app.store.all<Link>('links')), id, direction);

    if (!order) return;

    this.persist(order);
    this.announce(link, order);

    // The list is rebuilt from scratch, so the focused handle goes with it.
    this.refocusId = id;
    m.redraw.sync();
    this.refocus();
  }

  announce(link: Link, order: LinkOrderEntry[]): void {
    const at = describePosition(order, String(link.id()));

    if (!at) return;

    const parent = at.parentId ? app.store.getById<Link>('links', at.parentId) : null;

    this.announcement = parent
      ? app.translator.trans('fof-links.admin.links.moved_under', {
          title: link.title(),
          parent: parent.title(),
          position: at.position,
          total: at.total,
        })
      : app.translator.trans('fof-links.admin.links.moved', {
          title: link.title(),
          position: at.position,
          total: at.total,
        });
  }

  refocus(): void {
    if (!this.refocusId) return;

    this.element?.querySelector<HTMLElement>(`.LinkListItem[data-id="${this.refocusId}"] .LinkListItem-handle`)?.focus();
    this.refocusId = null;
  }

  /**
   * The store is updated before the request comes back, so the list redraws in
   * the new order straight away.
   */
  persist(order: LinkOrderEntry[]): void {
    order.forEach((entry, position) => {
      const parent = app.store.getById<Link>('links', entry.id);

      if (!parent) return;

      parent.pushData({
        attributes: { position, isChild: false },
        relationships: { parent: null },
      });

      entry.children.forEach((childId, childPosition) => {
        app.store.getById<Link>('links', childId)?.pushData({
          attributes: { position: childPosition, isChild: true },
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
