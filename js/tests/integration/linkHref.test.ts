import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import LinkItem from '../../src/forum/components/LinkItem';
import type Link from '../../src/common/models/Link';

beforeAll(() => {
  bootstrapForum();
  app.boot();
});

/**
 * A LinkItem instance whose `attrs.link` is a stand-in exposing only the
 * methods `linkHref`/`isLabel` read.
 */
function item(url: string, isInternal = false): LinkItem {
  const instance = new LinkItem();

  instance.attrs = {
    link: {
      url: () => url,
      isInternal: () => isInternal,
    } as unknown as Link,
  } as any;

  return instance;
}

describe('LinkItem.linkHref', () => {
  it('prefixes an internal, root-relative link with the forum base URL', () => {
    app.forum.pushAttributes({ baseUrl: 'https://example.com' });

    expect(item('/tags', true).linkHref).toBe('https://example.com/tags');
  });

  it('leaves an absolute URL untouched', () => {
    expect(item('https://flarum.org', false).linkHref).toBe('https://flarum.org');
  });

  it('does not prefix a root-relative link that is not marked internal', () => {
    expect(item('/tags', false).linkHref).toBe('/tags');
  });
});

describe('LinkItem.isLabel', () => {
  it('is a label when the URL is empty', () => {
    expect(item('').isLabel).toBe(true);
  });

  it('is not a label when the URL is set', () => {
    expect(item('/tags').isLabel).toBe(false);
  });
});
