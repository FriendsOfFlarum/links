import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import mq from 'mithril-query';

import LinkModel from '../../src/common/models/Link';
import LabelDropdown from '../../src/forum/components/LabelDropdown';
import LinkDropdown from '../../src/forum/components/LinkDropdown';
import LinkItem from '../../src/forum/components/LinkItem';

beforeAll(() => {
  bootstrapForum();
  app.boot();
  app.store.models.links = LinkModel;

  // The forum sets this when it mounts, which the test app never does.
  // Without it Mithril prefixes every routed href with its default `#!`.
  m.route.prefix = '';
});

beforeEach(() => {
  app.forum.pushAttributes({ baseUrl: 'https://example.com' });
  m.route.get = () => '/';
});

let nextId = 1;

function link(attributes: Record<string, unknown> = {}, parent?: LinkModel): LinkModel {
  const id = String(nextId++);

  return app.store.pushPayload<LinkModel>({
    data: {
      type: 'links',
      id,
      attributes: {
        title: `Link ${id}`,
        icon: '',
        url: `/page-${id}`,
        isInternal: true,
        isNewtab: false,
        useRelMe: false,
        isChild: !!parent,
        position: Number(id),
        ...attributes,
      },
      relationships: parent ? { parent: { data: { type: 'links', id: parent.id() } } } : {},
    },
  } as any) as unknown as LinkModel;
}

describe('LinkItem', () => {
  it('renders an internal link as a header button', () => {
    const item = mq(LinkItem, { link: link({ url: '/tags' }) });

    expect(item).toHaveElement('a.LinksButton.Button.Button--link[href="https://example.com/tags"]');
    expect(item).not.toHaveElement('a[target]');
  });

  it('opens a new-tab link in a new tab, with the rel it needs', () => {
    const item = mq(LinkItem, { link: link({ url: 'https://flarum.org', isInternal: false, isNewtab: true, useRelMe: true }) });

    expect(item).toHaveElement('a[target="_blank"][rel="noopener noreferrer me"]');
  });

  it('drops the button styling inside a menu', () => {
    const item = mq(LinkItem, { link: link(), inDropdown: true });

    expect(item).toHaveElement('a.LinksButton');
    expect(item).not.toHaveElement('.Button');
  });

  it('marks the current page, for the item and for the list around it', () => {
    const current = link({ url: '/tags' });
    m.route.get = () => '/tags';

    expect(mq(LinkItem, { link: current })).toHaveElement('a[aria-current="page"]');
    expect(LinkItem.isActive({ link: current })).toBe(true);
    expect(LinkItem.isActive({ link: link() })).toBe(false);
  });
});

describe('LinkDropdown', () => {
  it('keeps the group link beside a toggle, and leads the menu with it', () => {
    const parent = link({ url: '/community' });
    link({}, parent);
    link({}, parent);

    const dropdown = mq(LinkDropdown, { link: parent });

    expect(dropdown).toHaveElement('.LinkDropdown.Dropdown--split > a.SplitDropdown-button[href="https://example.com/community"]');
    expect(dropdown).toHaveElement('.LinkDropdown > button.Dropdown-toggle[aria-haspopup="menu"]');
    expect(dropdown.find('.LinkDropdown-menu > li')).toHaveLength(3);
    expect(dropdown).toHaveElement('.LinkDropdown-menu > li:first-child > a[href="https://example.com/community"]');
  });
});

describe('LabelDropdown', () => {
  it('opens from the label, and leads the menu with it as a heading', () => {
    const parent = link({ title: 'Resources', url: '' });
    const child = link({}, parent);
    const heading = link({ title: 'More', url: '' }, parent);

    const dropdown = mq(LabelDropdown, { link: parent });

    expect(dropdown).not.toHaveElement('.Dropdown--split');
    expect(dropdown).toHaveElement('.LinkDropdown > button.Dropdown-toggle.LinksButton');
    expect(dropdown).toHaveElement('.LinkDropdown-menu > li.LinksHeading:first-child');
    expect(dropdown).toHaveElement(`.LinkDropdown-menu a[href="https://example.com${child.url()}"]`);
    expect(dropdown.find('.LinkDropdown-menu > li.LinksHeading')).toHaveLength(2);
    expect(heading.isLabel()).toBe(true);
  });

  it('is marked active when a link under it is the current page', () => {
    const parent = link({ url: '' });
    link({ url: '/docs' }, parent);
    m.route.get = () => '/docs';

    expect(mq(LabelDropdown, { link: parent })).toHaveElement('.LinkDropdown.LinkDropdown--active');
  });
});
