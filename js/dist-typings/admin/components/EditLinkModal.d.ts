import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import Group from 'flarum/common/models/Group';
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
    link: Link;
    itemTitle: Stream<string>;
    icon: Stream<string>;
    url: Stream<string>;
    isInternal: Stream<boolean>;
    isNewtab: Stream<boolean>;
    useRelMe: Stream<boolean>;
    guestOnly: Stream<boolean>;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    getGroup(id: string): Group | undefined;
    items(): ItemList<Mithril.Children>;
    submitData(): Record<string, unknown>;
    onsubmit(e: SubmitEvent): void;
    delete(): void;
    updateInternalUrl(): void;
}
