import app from 'flarum/admin/app';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Form from 'flarum/common/components/Form';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import Icon from 'flarum/common/components/Icon';
import withAttr from 'flarum/common/utils/withAttr';
import ItemList from 'flarum/common/utils/ItemList';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import Alert from 'flarum/common/components/Alert';
import Group from 'flarum/common/models/Group';
import LinkComponent from 'flarum/common/components/Link';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

import type Link from '../../common/models/Link';

export interface IEditLinkModalAttrs extends IFormModalAttrs {
  link?: Link;
}

/**
 * The `EditLinkModal` component shows a modal dialog which allows the user
 * to create or edit a link.
 */
export default class EditLinkModal<CustomAttrs extends IEditLinkModalAttrs = IEditLinkModalAttrs> extends FormModal<CustomAttrs> {
  link!: Link;
  itemTitle!: Stream<string>;
  icon!: Stream<string>;
  url!: Stream<string>;
  isInternal!: Stream<boolean>;
  isNewtab!: Stream<boolean>;
  useRelMe!: Stream<boolean>;
  guestOnly!: Stream<boolean>;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.link = this.attrs.link || app.store.createRecord<Link>('links');

    this.itemTitle = Stream(this.link.title() || '');
    this.icon = Stream(this.link.icon() || '');
    this.url = Stream(this.link.url() || '');
    this.isInternal = Stream(!!this.link.isInternal());
    this.isNewtab = Stream(!!this.link.isNewtab());
    this.useRelMe = Stream(!!this.link.useRelMe());
    this.guestOnly = Stream(!!this.link.guestOnly());

    if (this.isInternal()) {
      this.updateInternalUrl();
    }
  }

  className() {
    return 'EditLinkModal Modal--medium';
  }

  title(): Mithril.Children {
    const title = this.itemTitle();

    if (!title) {
      return app.translator.trans('fof-links.admin.edit_link.title');
    }

    const iconClass = this.icon();

    if (iconClass) {
      return (
        <>
          <Icon name={iconClass} /> {title}
        </>
      );
    }

    return title;
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <Form>{this.items().toArray()}</Form>
      </div>
    );
  }

  getGroup(id: string): Group | undefined {
    return app.store.getById<Group>('groups', id);
  }

  items(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    const permissionPriority = 200;
    if (this.link.exists) {
      const adminLabel = this.getGroup(Group.ADMINISTRATOR_ID)?.nameSingular();
      const guestLabel = this.getGroup(Group.GUEST_ID)?.namePlural();
      const everyoneLabel = app.translator.trans('core.admin.permissions_controls.everyone_button');

      items.add(
        'visibility-permission',
        [
          <div className="Form-group">
            <label>{app.translator.trans('fof-links.admin.edit_link.visibility.label')}</label>
            <p className="helpText">{app.translator.trans('fof-links.admin.edit_link.visibility.help', { admin: adminLabel })}</p>
            <PermissionDropdown permission={`link${this.link.id()}.view`} allowGuest={true} />
          </div>,
          <div className="Form-group">
            <label className="checkbox">
              <input type="checkbox" value="1" bidi={this.guestOnly} />
              {app.translator.trans('fof-links.admin.edit_link.visibility.guest-only.label', { guest: guestLabel })}
            </label>
            <p className="helpText">
              {app.translator.trans('fof-links.admin.edit_link.visibility.guest-only.help', { guest: guestLabel, everyone: everyoneLabel })}
            </p>
          </div>,
        ],
        permissionPriority
      );
    } else {
      items.add(
        'visibility-permission-disabled',
        [
          <div className="Form-group">
            <label>{app.translator.trans('fof-links.admin.edit_link.visibility.label')}</label>
            <Alert dismissible={false} type="warning">
              {app.translator.trans('fof-links.admin.edit_link.visibility.help-disabled')}
            </Alert>
          </div>,
        ],
        permissionPriority
      );
    }

    items.add(
      'title',
      <div className="Form-group">
        <label>{app.translator.trans('fof-links.admin.edit_link.title_label')}</label>
        <input
          className="FormControl"
          placeholder={extractText(app.translator.trans('fof-links.admin.edit_link.title_placeholder'))}
          bidi={this.itemTitle}
        />
      </div>,
      100
    );

    items.add(
      'icon',
      <div className="Form-group">
        <label>{app.translator.trans('fof-links.admin.edit_link.icon_label')}</label>
        <div className="helpText">
          {app.translator.trans('fof-links.admin.edit_link.icon_text', {
            a: (
              <LinkComponent
                className="Button--link"
                href={app.refs.fontawesome}
                tabindex="-1"
                external={true}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          })}
          <br />
          {app.translator.trans('fof-links.admin.edit_link.icon_additional_text')}
        </div>
        <input className="FormControl" placeholder="fas fa-bolt" value={this.icon()} oninput={withAttr('value', this.icon)} />
      </div>,
      80
    );

    items.add(
      'url',
      <div className="Form-group">
        <label htmlFor="link-url">{app.translator.trans('fof-links.admin.edit_link.url_label')}</label>
        <p className="helpText" id="link-url-help">
          {app.translator.trans('fof-links.admin.edit_link.url_description')}
        </p>
        <div id="link-url-input" data-internal={this.isInternal()}>
          {this.isInternal() && (
            <label htmlFor="link-url" className="link-url-prefix">
              {app.forum.attribute('baseUrl')}
            </label>
          )}
          <input
            id="link-url"
            aria-describedby="link-url-help"
            className="FormControl"
            placeholder={extractText(app.translator.trans('fof-links.admin.edit_link.url_placeholder'))}
            type="text"
            required={this.isInternal() || this.isNewtab()}
            bidi={this.url}
          />
        </div>
      </div>,
      60
    );

    items.add(
      'checkboxes',
      <div className="Form-group">
        <div>
          <label className="checkbox">
            <input
              type="checkbox"
              value="1"
              checked={this.isInternal()}
              onchange={(e: Event) => {
                const target = e.target as HTMLInputElement;
                if (this.isInternal(target.checked)) {
                  this.isNewtab(false);
                }

                this.updateInternalUrl();
              }}
            />
            {app.translator.trans('fof-links.admin.edit_link.internal_link')}
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              value="1"
              checked={this.isNewtab()}
              onchange={(e: Event) => {
                const target = e.target as HTMLInputElement;
                if (this.isNewtab(target.checked) && this.isInternal()) {
                  this.isInternal(false);
                  this.updateInternalUrl();
                }
              }}
            />
            {app.translator.trans('fof-links.admin.edit_link.open_newtab')}
          </label>
          <label className="checkbox">
            <input type="checkbox" value="1" bidi={this.useRelMe} />
            {app.translator.trans('fof-links.admin.edit_link.use_rel_me')}
          </label>
        </div>
      </div>,
      40
    );

    items.add(
      'actions',
      <div className="Form-group">
        <Button type="submit" className="Button Button--primary EditLinkModal-save" loading={this.loading}>
          {app.translator.trans('fof-links.admin.edit_link.submit_button')}
        </Button>
        {this.link.exists && (
          <button type="button" className="Button Button--danger EditLinkModal-delete" onclick={this.delete.bind(this)}>
            {app.translator.trans('fof-links.admin.edit_link.delete_link_button')}
          </button>
        )}
      </div>,
      0
    );

    return items;
  }

  submitData(): Record<string, unknown> {
    return {
      title: this.itemTitle(),
      icon: this.icon(),
      url: this.url(),
      isInternal: this.isInternal(),
      isNewtab: this.isNewtab(),
      useRelMe: this.useRelMe(),
      guestOnly: this.guestOnly(),
    };
  }

  onsubmit(e: SubmitEvent) {
    e.preventDefault();

    this.loading = true;

    this.link
      .save(this.submitData(), { errorHandler: this.onerror.bind(this) })
      .then(this.hide.bind(this))
      .catch(() => {
        this.loading = false;
        m.redraw();
      });
  }

  delete() {
    if (confirm(extractText(app.translator.trans('fof-links.admin.edit_link.delete_link_confirmation')))) {
      this.link.delete().then(() => m.redraw());
      this.hide();
    }
  }

  updateInternalUrl() {
    const base = app.forum.attribute<string>('baseUrl');
    const url = this.url();

    if (this.isInternal()) {
      this.url(url.replace(base, ''));
    } else if (url.startsWith('/')) {
      this.url(base + url);
    }
  }
}
