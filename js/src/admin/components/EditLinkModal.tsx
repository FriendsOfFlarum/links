import app from 'flarum/admin/app';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Form from 'flarum/common/components/Form';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import Switch from 'flarum/common/components/Switch';
import Alert from 'flarum/common/components/Alert';
import LinkComponent from 'flarum/common/components/Link';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import Group from 'flarum/common/models/Group';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import withAttr from 'flarum/common/utils/withAttr';
import type Mithril from 'mithril';

import type Link from '../../common/models/Link';
import type { LinkType } from '../../common/models/Link';

export interface IEditLinkModalAttrs extends IFormModalAttrs {
  link?: Link;
  /** The link a newly created one should be nested under. */
  parent?: Link;
}

const LINK_TYPES: LinkType[] = ['internal', 'external', 'label'];

/**
 * The stored flags are not independent — a label has no URL and so cannot open
 * in a tab, and an internal link is routed rather than followed. They are
 * offered here as the one choice they are, with the fields that only apply to
 * some of those choices shown only for those.
 */
export default class EditLinkModal<CustomAttrs extends IEditLinkModalAttrs = IEditLinkModalAttrs> extends FormModal<CustomAttrs> {
  link!: Link;

  itemTitle!: Stream<string>;
  icon!: Stream<string>;
  url!: Stream<string>;
  linkType!: Stream<LinkType>;
  isNewtab!: Stream<boolean>;
  useRelMe!: Stream<boolean>;
  guestOnly!: Stream<boolean>;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.link = this.attrs.link || app.store.createRecord<Link>('links');

    this.itemTitle = Stream(this.link.title() || '');
    this.icon = Stream(this.link.icon() || '');
    this.url = Stream(this.link.url() || '');
    this.linkType = Stream<LinkType>(this.link.exists ? this.link.linkType() : 'internal');
    this.isNewtab = Stream(!!this.link.isNewtab());
    this.useRelMe = Stream(!!this.link.useRelMe());
    this.guestOnly = Stream(!!this.link.guestOnly());

    this.rewriteUrlForType();
  }

  className() {
    return 'EditLinkModal';
  }

  title(): Mithril.Children {
    const title = this.itemTitle();

    if (!title) {
      return this.attrs.parent
        ? app.translator.trans('fof-links.admin.edit_link.title_child', { parent: this.attrs.parent.title() })
        : app.translator.trans('fof-links.admin.edit_link.title');
    }

    const iconClass = this.icon();

    return (
      <span className="EditLinkModal-preview">
        {iconClass && <Icon name={iconClass} />}
        <span className="EditLinkModal-previewTitle">{title}</span>
      </span>
    );
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <Form>{this.fields().toArray()}</Form>
      </div>
    );
  }

  fields(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('title', this.titleField(), 100);
    items.add('icon', this.iconField(), 90);
    items.add('type', this.typeField(), 80);

    if (this.linkType() !== 'label') {
      items.add('url', this.urlField(), 70);
    }

    if (this.linkType() === 'external') {
      items.add('options', this.optionsField(), 60);
    }

    items.add('visibility', this.visibilityField(), 40);
    items.add('actions', this.actionsField(), 0);

    return items;
  }

  titleField(): Mithril.Children {
    return (
      <div className="Form-group">
        <label for="fof-links-title">{app.translator.trans('fof-links.admin.edit_link.title_label')}</label>
        <input
          id="fof-links-title"
          name="title"
          className="FormControl"
          placeholder={extractText(app.translator.trans('fof-links.admin.edit_link.title_placeholder'))}
          required={true}
          bidi={this.itemTitle}
        />
      </div>
    );
  }

  iconField(): Mithril.Children {
    return (
      <div className="Form-group">
        <label for="fof-links-icon">{app.translator.trans('fof-links.admin.edit_link.icon_label')}</label>
        <div className="helpText" id="fof-links-icon-help">
          {app.translator.trans('fof-links.admin.edit_link.icon_text', {
            a: (
              <LinkComponent
                className="Button--text"
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
        <input
          id="fof-links-icon"
          name="icon"
          aria-describedby="fof-links-icon-help"
          className="FormControl"
          placeholder="fas fa-bolt"
          bidi={this.icon}
        />
      </div>
    );
  }

  typeField(): Mithril.Children {
    return (
      <div className="Form-group">
        <label>{app.translator.trans('fof-links.admin.edit_link.type.heading')}</label>
        <div>
          {LINK_TYPES.map((type) => (
            <label className="checkbox">
              <input
                type="radio"
                name="fof-links-type"
                value={type}
                checked={this.linkType() === type}
                onclick={withAttr('value', (value: string) => this.setLinkType(value as LinkType))}
              />
              <strong>{app.translator.trans(`fof-links.admin.edit_link.type.${type}.label`)}</strong>
              {app.translator.trans(`fof-links.admin.edit_link.type.${type}.help`)}
            </label>
          ))}
        </div>
      </div>
    );
  }

  urlField(): Mithril.Children {
    const isInternal = this.linkType() === 'internal';
    const variant = isInternal ? 'internal' : 'external';

    return (
      <div className="Form-group">
        <label for="fof-links-url">{app.translator.trans('fof-links.admin.edit_link.url_label')}</label>
        <p className="helpText" id="fof-links-url-help">
          {app.translator.trans(`fof-links.admin.edit_link.url_help.${variant}`)}
        </p>
        <div className={`LinkUrlInput${isInternal ? ' LinkUrlInput--prefixed' : ''}`}>
          {isInternal && (
            <span className="LinkUrlInput-prefix" aria-hidden="true">
              {app.forum.attribute('baseUrl')}
            </span>
          )}
          <input
            id="fof-links-url"
            name="url"
            aria-describedby="fof-links-url-help"
            className="FormControl"
            type="text"
            required={true}
            placeholder={extractText(app.translator.trans(`fof-links.admin.edit_link.url_placeholder.${variant}`))}
            bidi={this.url}
          />
        </div>
      </div>
    );
  }

  optionsField(): Mithril.Children {
    return (
      <div className="Form-group EditLinkModal-options">
        <label>{app.translator.trans('fof-links.admin.edit_link.options_label')}</label>
        <Switch state={this.isNewtab()} onchange={this.isNewtab}>
          {app.translator.trans('fof-links.admin.edit_link.open_newtab')}
        </Switch>
        <Switch state={this.useRelMe()} onchange={this.useRelMe}>
          {app.translator.trans('fof-links.admin.edit_link.use_rel_me')}
        </Switch>
        <p className="helpText">{app.translator.trans('fof-links.admin.edit_link.use_rel_me_help')}</p>
      </div>
    );
  }

  visibilityField(): Mithril.Children {
    const adminLabel = this.group(Group.ADMINISTRATOR_ID)?.nameSingular();
    const guestLabel = this.group(Group.GUEST_ID)?.namePlural();
    const everyoneLabel = app.translator.trans('core.admin.permissions_controls.everyone_button');

    return (
      <div className="Form-group EditLinkModal-visibility">
        <label>{app.translator.trans('fof-links.admin.edit_link.visibility.label')}</label>
        {this.link.exists ? (
          <>
            <p className="helpText">{app.translator.trans('fof-links.admin.edit_link.visibility.help', { admin: adminLabel })}</p>
            <PermissionDropdown permission={`link${this.link.id()}.view`} allowGuest={true} />
          </>
        ) : (
          <Alert dismissible={false} type="warning">
            {app.translator.trans('fof-links.admin.edit_link.visibility.help-disabled')}
          </Alert>
        )}
        <Switch state={this.guestOnly()} onchange={this.guestOnly}>
          {app.translator.trans('fof-links.admin.edit_link.visibility.guest-only.label', { guest: guestLabel })}
        </Switch>
        <p className="helpText">
          {app.translator.trans('fof-links.admin.edit_link.visibility.guest-only.help', { guest: guestLabel, everyone: everyoneLabel })}
        </p>
      </div>
    );
  }

  actionsField(): Mithril.Children {
    return (
      <div className="Form-group Form-controls">
        <Button type="submit" className="Button Button--primary EditLinkModal-save" loading={this.loading}>
          {app.translator.trans('fof-links.admin.edit_link.submit_button')}
        </Button>
        {this.link.exists && (
          <Button className="Button Button--danger EditLinkModal-delete" onclick={this.delete.bind(this)}>
            {app.translator.trans('fof-links.admin.edit_link.delete_link_button')}
          </Button>
        )}
      </div>
    );
  }

  group(id: string): Group | undefined {
    return app.store.getById<Group>('groups', id);
  }

  setLinkType(type: LinkType): void {
    if (this.linkType() === type) return;

    this.linkType(type);
    this.rewriteUrlForType();
  }

  /**
   * Internal addresses are stored relative to the forum root and shown with a
   * fixed prefix, so what was typed moves in and out of that form as the type
   * changes.
   */
  rewriteUrlForType(): void {
    const base = app.forum.attribute<string>('baseUrl');
    const url = this.url();

    if (this.linkType() === 'internal') {
      if (url.startsWith(base)) this.url(url.slice(base.length));
    } else if (url.startsWith('/')) {
      this.url(base + url);
    }
  }

  submitData(): Record<string, unknown> {
    const type = this.linkType();

    const data: Record<string, unknown> = {
      title: this.itemTitle(),
      icon: this.icon(),
      url: type === 'label' ? '' : this.url(),
      isInternal: type === 'internal',
      isNewtab: type === 'external' && this.isNewtab(),
      useRelMe: type === 'external' && this.useRelMe(),
      guestOnly: this.guestOnly(),
    };

    if (!this.link.exists && this.attrs.parent) {
      data.relationships = { parent: this.attrs.parent };
    }

    return data;
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

  delete(): void {
    if (!confirm(extractText(app.translator.trans('fof-links.admin.edit_link.delete_link_confirmation', { title: this.link.title() })))) {
      return;
    }

    // The database drops the parent reference rather than the links using it,
    // so anything nested under this one comes back onto the row.
    const children = app.store.all<Link>('links').filter((link) => link.parent() === this.link);

    this.link.delete().then(() => {
      children.forEach((child) =>
        child.pushData({
          attributes: { isChild: false },
          relationships: { parent: null },
        })
      );

      m.redraw();
    });

    this.hide();
  }
}
