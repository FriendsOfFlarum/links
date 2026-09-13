import app from 'flarum/admin/app';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import FieldSet from 'flarum/common/components/FieldSet';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import LinkComponent from 'flarum/common/components/Link';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import Group from 'flarum/common/models/Group';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
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
 * The stored flags are not independent: a label has no URL, so it cannot open
 * in a tab, and an internal link is routed rather than followed. They are
 * offered as a single choice of type, and fields that only apply to some types
 * are shown only for those.
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

    // Runs once now, then whenever the type changes.
    this.linkType.map(() => this.rewriteUrlForType());
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

    const icon = this.icon();

    return (
      <>
        {!!icon && <Icon name={icon} />} {title}
      </>
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
    const type = this.linkType();

    items.add('title', this.titleField(), 100);
    items.add('icon', this.iconField(), 90);
    items.add('type', this.typeField(), 80);

    if (type !== 'label') {
      items.add('url', this.urlField(), 70);
    }

    if (type === 'external') {
      items.add('options', this.optionsField(), 60);
    }

    items.add('visibility', this.visibilityField(), 40);
    items.add('actions', this.actionsField(), 0);

    return items;
  }

  titleField(): Mithril.Children {
    return (
      <FormGroup
        type="text"
        name="title"
        label={app.translator.trans('fof-links.admin.edit_link.title_label')}
        placeholder={extractText(app.translator.trans('fof-links.admin.edit_link.title_placeholder'))}
        required={true}
        stream={this.itemTitle}
      />
    );
  }

  iconField(): Mithril.Children {
    return (
      <FormGroup
        type="text"
        name="icon"
        label={app.translator.trans('fof-links.admin.edit_link.icon_label')}
        help={[
          app.translator.trans('fof-links.admin.edit_link.icon_text', {
            a: <LinkComponent href={app.refs.fontawesome} external={true} target="_blank" rel="noopener noreferrer" tabindex="-1" />,
          }),
          <br />,
          app.translator.trans('fof-links.admin.edit_link.icon_additional_text'),
        ]}
        placeholder="fas fa-bolt"
        stream={this.icon}
      />
    );
  }

  typeField(): Mithril.Children {
    const options: Record<string, string> = {};

    LINK_TYPES.forEach((type) => {
      options[type] = extractText(app.translator.trans(`fof-links.admin.edit_link.type.${type}.label`));
    });

    return (
      <FormGroup
        type="select"
        name="type"
        label={app.translator.trans('fof-links.admin.edit_link.type.heading')}
        help={app.translator.trans(`fof-links.admin.edit_link.type.${this.linkType()}.help`)}
        options={options}
        default="internal"
        stream={this.linkType}
      />
    );
  }

  urlField(): Mithril.Children {
    const variant = this.linkType() === 'internal' ? 'internal' : 'external';

    return (
      <FormGroup
        type="text"
        name="url"
        label={app.translator.trans('fof-links.admin.edit_link.url_label')}
        help={app.translator.trans(`fof-links.admin.edit_link.url_help.${variant}`, {
          baseUrl: <code>{app.forum.attribute('baseUrl')}</code>,
        })}
        placeholder={extractText(app.translator.trans(`fof-links.admin.edit_link.url_placeholder.${variant}`))}
        required={true}
        stream={this.url}
      />
    );
  }

  optionsField(): Mithril.Children {
    return (
      <FieldSet className="FieldSet--form" label={extractText(app.translator.trans('fof-links.admin.edit_link.options_label'))}>
        <FormGroup type="switch" label={app.translator.trans('fof-links.admin.edit_link.open_newtab')} stream={this.isNewtab} />
        <FormGroup
          type="switch"
          label={app.translator.trans('fof-links.admin.edit_link.use_rel_me')}
          help={app.translator.trans('fof-links.admin.edit_link.use_rel_me_help')}
          stream={this.useRelMe}
        />
      </FieldSet>
    );
  }

  visibilityField(): Mithril.Children {
    const admin = this.group(Group.ADMINISTRATOR_ID)?.nameSingular();
    const guest = this.group(Group.GUEST_ID)?.namePlural();
    const everyone = app.translator.trans('core.admin.permissions_controls.everyone_button');

    // The permission is keyed by the link's ID, so it only exists once saved.
    const description = this.link.exists
      ? app.translator.trans('fof-links.admin.edit_link.visibility.help', { admin })
      : app.translator.trans('fof-links.admin.edit_link.visibility.help-disabled');

    return (
      <FieldSet
        className="FieldSet--form"
        label={extractText(app.translator.trans('fof-links.admin.edit_link.visibility.label'))}
        description={extractText(description)}
      >
        {this.link.exists && <PermissionDropdown permission={`link${this.link.id()}.view`} allowGuest={true} />}
        <FormGroup
          type="switch"
          label={app.translator.trans('fof-links.admin.edit_link.visibility.guest-only.label', { guest })}
          help={app.translator.trans('fof-links.admin.edit_link.visibility.guest-only.help', { guest, everyone })}
          stream={this.guestOnly}
        />
      </FieldSet>
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

  /**
   * Internal addresses are stored relative to the forum root, so what was typed
   * moves in and out of that form as the type changes.
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
