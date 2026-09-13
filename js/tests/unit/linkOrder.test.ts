import { describePosition, moveLink, type LinkOrderEntry } from '../../src/admin/utils/linkOrder';

function order(): LinkOrderEntry[] {
  return [
    { id: '1', children: ['4', '5'] },
    { id: '2', children: [] },
    { id: '3', children: [] },
  ];
}

describe('moveLink on a link in the row', () => {
  it('swaps with the link above it', () => {
    expect(moveLink(order(), '2', 'up')).toEqual([
      { id: '2', children: [] },
      { id: '1', children: ['4', '5'] },
      { id: '3', children: [] },
    ]);
  });

  it('swaps with the link below it', () => {
    expect(moveLink(order(), '2', 'down')).toEqual([
      { id: '1', children: ['4', '5'] },
      { id: '3', children: [] },
      { id: '2', children: [] },
    ]);
  });

  it('has nowhere to go past either end', () => {
    expect(moveLink(order(), '1', 'up')).toBeNull();
    expect(moveLink(order(), '3', 'down')).toBeNull();
  });

  it('nests under the link above it', () => {
    expect(moveLink(order(), '2', 'in')).toEqual([
      { id: '1', children: ['4', '5', '2'] },
      { id: '3', children: [] },
    ]);
  });

  it('cannot nest the first link, or one that has links under it', () => {
    expect(moveLink(order(), '1', 'in')).toBeNull();

    const withChildren: LinkOrderEntry[] = [
      { id: '1', children: [] },
      { id: '2', children: ['4'] },
    ];

    expect(moveLink(withChildren, '2', 'in')).toBeNull();
  });

  it('is already out', () => {
    expect(moveLink(order(), '2', 'out')).toBeNull();
  });
});

describe('moveLink on a nested link', () => {
  it('swaps with its siblings', () => {
    expect(moveLink(order(), '5', 'up')?.[0]).toEqual({ id: '1', children: ['5', '4'] });
    expect(moveLink(order(), '4', 'down')?.[0]).toEqual({ id: '1', children: ['5', '4'] });
  });

  it('lifts out above the group when moved up from the first position', () => {
    expect(moveLink(order(), '4', 'up')).toEqual([
      { id: '4', children: [] },
      { id: '1', children: ['5'] },
      { id: '2', children: [] },
      { id: '3', children: [] },
    ]);
  });

  it('lifts out below the group when moved down from the last position', () => {
    expect(moveLink(order(), '5', 'down')).toEqual([
      { id: '1', children: ['4'] },
      { id: '5', children: [] },
      { id: '2', children: [] },
      { id: '3', children: [] },
    ]);
  });

  it('lifts out directly after the group', () => {
    expect(moveLink(order(), '4', 'out')).toEqual([
      { id: '1', children: ['5'] },
      { id: '4', children: [] },
      { id: '2', children: [] },
      { id: '3', children: [] },
    ]);
  });

  it('cannot nest any deeper', () => {
    expect(moveLink(order(), '4', 'in')).toBeNull();
  });
});

describe('moveLink', () => {
  it('leaves the order it was given untouched', () => {
    const original = order();
    const copy = JSON.parse(JSON.stringify(original));

    moveLink(original, '4', 'out');

    expect(original).toEqual(copy);
  });

  it('ignores an id that is not in the order', () => {
    expect(moveLink(order(), '99', 'up')).toBeNull();
  });
});

describe('describePosition', () => {
  it('describes a link in the row', () => {
    expect(describePosition(order(), '3')).toEqual({ position: 3, total: 3, parentId: null });
  });

  it('describes a nested link relative to its group', () => {
    expect(describePosition(order(), '5')).toEqual({ position: 2, total: 2, parentId: '1' });
  });

  it('returns nothing for an id that is not in the order', () => {
    expect(describePosition(order(), '99')).toBeNull();
  });
});
