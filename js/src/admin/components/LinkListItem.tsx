import app from 'flarum/admin/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import Pill from 'flarum/common/components/Pill';
import Tooltip from 'flarum/common/components/Tooltip';
import GroupBadge from 'flarum/common/components/GroupBadge';
import Badge from 'flarum/common/components/Badge';
import Group from 'flarum/common/models/Group';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

import type Link from '../../common/models/Link';
import type { MoveDirection } from '../utils/linkOrder';

export interface ILinkListItemAttrs extends ComponentAttrs {
  link: Link;
  onmove: (link: Link, direction: MoveDirection) => void;
  onedit: (link: Link) => void;
  onaddchild?: (parent: Link) => void;
}

export default class LinkListItem<CustomAttrs extends ILinkListItemAttrs = ILinkListItemAttrs> extends Component<CustomAttrs> {
  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const link = this.attrs.link;
    const icon = link.icon();

    return (
      <li className="LinkListItem" data-id={link.id()}>
        <div className="LinkListItem-info">
          {this.handle()}
          {icon && <Icon name={icon} className="LinkListItem-icon" />}
          <span className="LinkListItem-name">{link.title()}</span>
          <span className="LinkListItem-url">{link.isLabel() ? app.translator.trans('fof-links.admin.links.no_url') : link.url()}</span>
          <span className="LinkListItem-flags">
            {this.flags().toArray()}
            {this.audience()}
          </span>
          <span className="LinkListItem-controls">{this.controls().toArray()}</span>
        </div>
        {vnode.children}
      </li>
    );
  }

  /**
   * A button rather than a decorative grip, so the list can also be rearranged
   * from the keyboard.
   */
  handle(): Mithril.Children {
    const link = this.attrs.link;

    // No tooltip: it would hang around for the length of a drag, and the help
    // text above the list already says what the handle does.
    return (
      <button
        type="button"
        className="LinkListItem-handle Button Button--icon Button--link"
        aria-label={extractText(app.translator.trans('fof-links.admin.links.reorder_accessible_label', { title: link.title() }))}
        aria-describedby="fof-links-reorder-help"
        onkeydown={this.onhandlekeydown.bind(this)}
      >
        <Icon name="fas fa-grip-vertical" className="Button-icon" />
      </button>
    );
  }

  onhandlekeydown(e: KeyboardEvent): void {
    const directions: Record<string, MoveDirection> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowRight: 'in',
      ArrowLeft: 'out',
    };

    const direction = directions[e.key];

    if (!direction) return;

    e.preventDefault();

    this.attrs.onmove(this.attrs.link, direction);
  }

  /**
   * Only what the address beside it does not already say.
   */
  flags(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const link = this.attrs.link;

    if (link.isNewtab()) {
      items.add('newtab', this.flag('fas fa-external-link-alt', app.translator.trans('fof-links.admin.links.flag.new_tab')), 100);
    }

    if (link.useRelMe()) {
      items.add('relme', this.flag('fas fa-fingerprint', app.translator.trans('fof-links.admin.links.flag.rel_me')), 90);
    }

    if (link.guestOnly()) {
      items.add('guest-only', this.flag('fas fa-user-slash', app.translator.trans('fof-links.admin.links.flag.guest_only')), 80);
    }

    return items;
  }

  flag(icon: string, label: Mithril.Children): Mithril.Children {
    return (
      <Pill>
        <Icon name={icon} />
        {label}
      </Pill>
    );
  }

  audience(): Mithril.Children {
    const link = this.attrs.link;

    if (!link.isRestricted()) {
      return (
        <Tooltip text={extractText(app.translator.trans('fof-links.admin.links.audience_everyone'))}>
          <span className="LinkListItem-audience">
            <Badge icon="fas fa-globe" label={null} />
          </span>
        </Tooltip>
      );
    }

    const groupIds: string[] = app.data.permissions[`link${link.id()}.view`] || [];
    const groups = [Group.ADMINISTRATOR_ID, ...groupIds]
      .map((id) => app.store.getById<Group>('groups', id))
      .filter((group): group is Group => !!group);

    return (
      <span className="LinkListItem-audience">
        {groups.map((group) => (
          <GroupBadge group={group} />
        ))}
      </span>
    );
  }

  controls(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const link = this.attrs.link;

    if (this.attrs.onaddchild) {
      items.add(
        'add-child',
        <Tooltip text={extractText(app.translator.trans('fof-links.admin.links.add_child_tooltip'))}>
          <Button
            className="Button Button--icon Button--link"
            icon="fas fa-level-down-alt"
            aria-label={extractText(app.translator.trans('fof-links.admin.links.add_child_accessible_label', { title: link.title() }))}
            onclick={() => this.attrs.onaddchild!(link)}
          />
        </Tooltip>,
        10
      );
    }

    items.add(
      'edit',
      <Tooltip text={extractText(app.translator.trans('fof-links.admin.links.edit_tooltip'))}>
        <Button
          className="Button Button--icon Button--link"
          icon="fas fa-pencil-alt"
          aria-label={extractText(app.translator.trans('fof-links.admin.links.edit_accessible_label', { title: link.title() }))}
          onclick={() => this.attrs.onedit(link)}
        />
      </Tooltip>,
      0
    );

    return items;
  }
}
