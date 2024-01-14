/* global m*/
/* global confirm*/

import app from 'flarum/admin/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import icon from 'flarum/common/helpers/icon';
import withAttr from 'flarum/common/utils/withAttr';
import ItemList from 'flarum/common/utils/ItemList';
import Select from 'flarum/common/components/Select';

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
    this.visibility = Stream(this.link.visibility() || 'everyone');

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

  items() {
    const items = new ItemList();

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
              a: <a href="https://fontawesome.com/v5/search?o=r&m=free" tabindex="-1" />,
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
      'visibility',
      [
        <div className="Form-group">
          <label>{app.translator.trans('fof-links.admin.edit_link.visibility')}</label>
          {Select.component({
            value: this.visibility(),
            onchange: this.visibility,
            options: this.typeOptions(),
          })}
        </div>,
      ],
      20
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

  typeOptions() {
    let opts;
    opts = ['everyone', 'members', 'guests'].reduce((o, key) => {
      o[key] = app.translator.trans(`fof-links.admin.edit_link.${key}-label`);

      return o;
    }, {});
    return opts;
  }

  submitData() {
    return {
      title: this.itemTitle(),
      icon: this.icon(),
      url: this.url(),
      isInternal: this.isInternal(),
      isNewtab: this.isNewtab(),
      useRelMe: this.useRelMe(),
      visibility: this.visibility(),
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
