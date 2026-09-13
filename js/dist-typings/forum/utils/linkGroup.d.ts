import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type LinkModel from '../../common/models/Link';
export declare function containsActiveLink(parent: LinkModel): boolean;
/**
 * A group's menu leads with the group itself. Core relies on that first entry:
 * a split dropdown hides it beside its own button, and the header's overflow
 * menu shows it as the title of the group.
 */
export declare function linkGroupItems(parent: LinkModel): ItemList<Mithril.Children>;
