import { childrenOf, hasChildren, rootLinks } from '../../src/common/utils/linkHierarchy';
import type Link from '../../src/common/models/Link';

function link(position: number | null, parent: Link | null = null): Link {
  const model = {
    position: () => position,
    parent: () => parent,
    isChild: () => !!parent,
  };

  return model as unknown as Link;
}

describe('rootLinks', () => {
  it('returns only the links that are not nested, ordered by position', () => {
    const first = link(0);
    const second = link(1);
    const child = link(0, first);

    expect(rootLinks([second, child, first])).toEqual([first, second]);
  });
});

describe('childrenOf', () => {
  it('returns the links nested under a parent, ordered by position', () => {
    const parent = link(0);
    const other = link(1);
    const a = link(1, parent);
    const b = link(0, parent);
    const elsewhere = link(0, other);

    expect(childrenOf([a, b, elsewhere], parent)).toEqual([b, a]);
  });
});

describe('hasChildren', () => {
  it('is true only when something is nested under the parent', () => {
    const parent = link(0);
    const other = link(1);

    expect(hasChildren([link(0, parent)], parent)).toBe(true);
    expect(hasChildren([link(0, other)], parent)).toBe(false);
  });
});
