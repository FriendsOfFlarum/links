/* global m*/
/* global confirm*/

import app from 'flarum/admin/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import icon from 'flarum/common/helpers/icon';
import withAttr from 'flarum/common/utils/withAttr';
import ItemList from 'flarum/common/utils/ItemList';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import Alert from 'flarum/common/components/Alert';
import Group from 'flarum/common/models/Group';
import Link from 'flarum/common/components/Link';
/**
 * The `EditlinksModal` component shows a modal dialog which allows the user
 * to create or edit a link.
 */
export default class EditlinksModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.link = this.attrs.link || app.store.createRecord('links');

    this.itemTitle = Stream(this.link.title() || '');
    this.icon = Stream(this.link.icon() || '');
    this.url = Stream(this.link.url() || '');
    this.isInternal = Stream(this.link.isInternal() && true);
    this.isNewtab = Stream(this.link.isNewtab() && true);
    this.useRelMe = Stream(this.link.useRelMe() && true);
    this.guestOnly = Stream(this.link.guestOnly() && true);

    if (this.isInternal()) {
      this.updateInternalUrl();
    }
  }

  className() {
    return 'EditLinkModal Modal--medium';
  }

  title() {
    const title = this.itemTitle();

    if (!title) {
      return app.translator.trans('fof-links.admin.edit_link.title');
    }

    const iconClass = this.icon();

    if (iconClass) {
      return (
        <>
          {icon(iconClass)} {title}
        </>
      );
    }

    return title;
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">{this.items().toArray()}</div>
      </div>
    );
  }

  getGroup(id) {
    return app.store.getById('groups', id);
  }

  items() {
    const items = new ItemList();

    const permissionPriority = 200;
    if (this.link.exists) {
      const adminLabel = this.getGroup(Group.ADMINISTRATOR_ID).nameSingular();
      const guestLabel = this.getGroup(Group.GUEST_ID).namePlural();
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
      [
        <div className="Form-group">
          <label>{app.translator.trans('fof-links.admin.edit_link.title_label')}</label>
          <input className="FormControl" placeholder={app.translator.trans('fof-links.admin.edit_link.title_placeholder')} bidi={this.itemTitle} />
        </div>,
      ],
      100
    );

    items.add(
      'icon',
      [
        <div className="Form-group">
          <label>{app.translator.trans('fof-links.admin.edit_link.icon_label')}</label>
          <div className="helpText">
            {app.translator.trans('fof-links.admin.edit_link.icon_text', {
              a: (
                <Link className="Button--link" href={app.refs.fontawesome} tabindex="-1" external={true} target="_blank" rel="noopener noreferrer" />
              ),
            })}
            <br />
            {app.translator.trans('fof-links.admin.edit_link.icon_additional_text')}
          </div>
          <input className="FormControl" placeholder="fas fa-bolt" value={this.icon()} oninput={withAttr('value', this.icon)} />
        </div>,
      ],
      80
    );

    items.add(
      'url',
      [
        <div className="Form-group">
          <label for="link-url">{app.translator.trans('fof-links.admin.edit_link.url_label')}</label>
          <p class="helpText" id="link-url-help">
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
              placeholder={app.translator.trans('fof-links.admin.edit_link.url_placeholder')}
              type="text"
              required={this.isInternal() || this.isNewtab()}
              bidi={this.url}
            />
          </div>
        </div>,
      ],
      60
    );

    items.add(
      'checkboxes',
      [
        <div className="Form-group">
          <div>
            <label className="checkbox">
              <input
                type="checkbox"
                value="1"
                checked={this.isInternal()}
                onchange={(e) => {
                  if (this.isInternal(e.target.checked)) {
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
                onchange={(e) => {
                  if (this.isNewtab(e.target.checked) && this.isInternal()) {
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
      ],
      40
    );

    items.add(
      'actions',
      [
        <div className="Form-group">
          {Button.component(
            {
              type: 'submit',
              className: 'Button Button--primary EditLinkModal-save',
              loading: this.loading,
            },
            app.translator.trans('fof-links.admin.edit_link.submit_button')
          )}
          {this.link.exists ? (
            <button type="button" className="Button Button--danger EditLinkModal-delete" onclick={() => this.delete()}>
              {app.translator.trans('fof-links.admin.edit_link.delete_link_button')}
            </button>
          ) : (
            ''
          )}
        </div>,
      ],
      0
    );

    return items;
  }

  submitData() {
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

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    this.link.save(this.submitData()).then(
      () => this.hide(),
      (response) => {
        this.loading = false;
        this.handleErrors(response);
      }
    );
  }

  delete() {
    if (confirm(app.translator.trans('fof-links.admin.edit_link.delete_link_confirmation'))) {
      this.link.delete().then(() => m.redraw());
      this.hide();
    }
  }

  updateInternalUrl() {
    const base = app.forum.attribute('baseUrl');
    const url = this.url();

    if (this.isInternal()) {
      this.url(url.replace(base, ''));
    } else if (url.startsWith('/')) {
      this.url(base + url);
    }
  }
}
