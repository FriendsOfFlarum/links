import type Link from '../../common/models/Link';
import { childrenOf, rootLinks } from '../../common/utils/linkHierarchy';

export interface LinkOrderEntry {
  id: string;
  children: string[];
}

export type MoveDirection = 'up' | 'down' | 'in' | 'out';

interface Position {
  root: number;
  child: number;
}

function clone(order: LinkOrderEntry[]): LinkOrderEntry[] {
  return order.map((entry) => ({ id: entry.id, children: [...entry.children] }));
}

function locate(order: LinkOrderEntry[], id: string): Position | null {
  for (let root = 0; root < order.length; root++) {
    if (order[root].id === id) return { root, child: -1 };

    const child = order[root].children.indexOf(id);

    if (child !== -1) return { root, child };
  }

  return null;
}

function swap<T>(items: T[], a: number, b: number): void {
  [items[a], items[b]] = [items[b], items[a]];
}

export function buildOrder(links: Link[]): LinkOrderEntry[] {
  return rootLinks(links).map((link) => ({
    id: String(link.id()),
    children: childrenOf(links, link).map((child) => String(child.id())),
  }));
}

/**
 * Dragging rearranges the DOM behind Mithril's back, so after a drag the DOM
 * is the only place the new order exists.
 */
export function orderFromDom(root: Element): LinkOrderEntry[] {
  return Array.from(root.querySelectorAll<HTMLLIElement>(':scope > li')).map((el) => ({
    id: String(el.dataset.id),
    children: Array.from(el.querySelectorAll<HTMLLIElement>('li')).map((child) => String(child.dataset.id)),
  }));
}

/**
 * Move one link one step, or return `null` when there is nowhere for it to go.
 *
 * `in` nests a link under the one above it; `out` lifts a nested link back onto
 * the row. Moving up from the first of a group, or down from the last, lifts it
 * out on the near side. Only two levels exist, so a link with links under it
 * cannot itself be nested.
 */
export function moveLink(order: LinkOrderEntry[], id: string, direction: MoveDirection): LinkOrderEntry[] | null {
  const at = locate(order, id);

  if (!at) return null;

  const next = clone(order);
  const { root, child } = at;

  if (child === -1) {
    switch (direction) {
      case 'up':
        if (root === 0) return null;
        swap(next, root, root - 1);
        return next;

      case 'down':
        if (root === next.length - 1) return null;
        swap(next, root, root + 1);
        return next;

      case 'in': {
        if (root === 0 || next[root].children.length > 0) return null;
        const [moved] = next.splice(root, 1);
        next[root - 1].children.push(moved.id);
        return next;
      }

      case 'out':
        return null;
    }
  }

  const siblings = next[root].children;

  switch (direction) {
    case 'up':
      if (child === 0) {
        siblings.splice(child, 1);
        next.splice(root, 0, { id, children: [] });
        return next;
      }
      swap(siblings, child, child - 1);
      return next;

    case 'down':
      if (child === siblings.length - 1) {
        siblings.splice(child, 1);
        next.splice(root + 1, 0, { id, children: [] });
        return next;
      }
      swap(siblings, child, child + 1);
      return next;

    case 'out':
      siblings.splice(child, 1);
      next.splice(root + 1, 0, { id, children: [] });
      return next;

    case 'in':
      return null;
  }
}

export function describePosition(order: LinkOrderEntry[], id: string): { position: number; total: number; parentId: string | null } | null {
  const at = locate(order, id);

  if (!at) return null;

  if (at.child === -1) {
    return { position: at.root + 1, total: order.length, parentId: null };
  }

  return {
    position: at.child + 1,
    total: order[at.root].children.length,
    parentId: order[at.root].id,
  };
}
