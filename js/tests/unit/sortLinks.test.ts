import sortLinks from '../../src/common/utils/sortLinks';
import type Link from '../../src/common/models/Link';

/**
 * A tiny stand-in for a Link model — sortLinks only reads `position()`.
 */
function link(position: number | null | undefined): Link {
  return { position: () => position } as unknown as Link;
}

describe('sortLinks', () => {
  it('orders links by ascending position', () => {
    const a = link(2);
    const b = link(0);
    const c = link(1);

    expect(sortLinks([a, b, c])).toEqual([b, c, a]);
  });

  it('treats a missing position as 0', () => {
    const first = link(null);
    const second = link(1);

    expect(sortLinks([second, first])).toEqual([first, second]);
  });

  it('is stable for equal positions', () => {
    const a = link(1);
    const b = link(1);

    expect(sortLinks([a, b])).toEqual([a, b]);
  });

  it('does not mutate the input array', () => {
    const input = [link(2), link(1)];
    const copy = [...input];

    sortLinks(input);

    expect(input).toEqual(copy);
  });
});
