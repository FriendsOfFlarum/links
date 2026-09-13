import type Link from '../../common/models/Link';
export interface LinkOrderEntry {
    id: string;
    children: string[];
}
export type MoveDirection = 'up' | 'down' | 'in' | 'out';
export declare function buildOrder(links: Link[]): LinkOrderEntry[];
/**
 * Dragging rearranges the DOM behind Mithril's back, so after a drag the DOM
 * is the only place the new order exists.
 */
export declare function orderFromDom(root: Element): LinkOrderEntry[];
/**
 * Move one link one step, or return `null` when there is nowhere for it to go.
 *
 * `in` nests a link under the one above it; `out` lifts a nested link back onto
 * the row. Moving up from the first of a group, or down from the last, lifts it
 * out on the near side. Only two levels exist, so a link with links under it
 * cannot itself be nested.
 */
export declare function moveLink(order: LinkOrderEntry[], id: string, direction: MoveDirection): LinkOrderEntry[] | null;
export declare function describePosition(order: LinkOrderEntry[], id: string): {
    position: number;
    total: number;
    parentId: string | null;
} | null;
