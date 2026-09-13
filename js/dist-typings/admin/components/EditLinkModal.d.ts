import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Group from 'flarum/common/models/Group';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type Link from '../../common/models/Link';
import type { LinkType } from '../../common/models/Link';
export interface IEditLinkModalAttrs extends IFormModalAttrs {
    link?: Link;
    /** The link a newly created one should be nested under. */
    parent?: Link;
}
/**
 * The stored flags are not independent: a label has no URL, so it cannot open
 * in a tab, and an internal link is routed rather than followed. They are
 * offered as a single choice of type, and fields that only apply to some types
 * are shown only for those.
 */
export default class EditLinkModal<CustomAttrs extends IEditLinkModalAttrs = IEditLinkModalAttrs> extends FormModal<CustomAttrs> {
    link: Link;
    itemTitle: Stream<string>;
    icon: Stream<string>;
    url: Stream<string>;
    linkType: Stream<LinkType>;
    isNewtab: Stream<boolean>;
    useRelMe: Stream<boolean>;
    guestOnly: Stream<boolean>;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    fields(): ItemList<Mithril.Children>;
    titleField(): Mithril.Children;
    iconField(): Mithril.Children;
    typeField(): Mithril.Children;
    urlField(): Mithril.Children;
    optionsField(): Mithril.Children;
    visibilityField(): Mithril.Children;
    actionsField(): Mithril.Children;
    group(id: string): Group | undefined;
    /**
     * Internal addresses are stored relative to the forum root, so what was typed
     * moves in and out of that form as the type changes.
     */
    rewriteUrlForType(): void;
    submitData(): Record<string, unknown>;
    onsubmit(e: SubmitEvent): void;
    delete(): void;
}
