import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import { isLinkActive, linkHref } from '../../src/forum/utils/linkTarget';
import type Link from '../../src/common/models/Link';

beforeAll(() => {
  bootstrapForum();
  app.boot();
});

/**
 * A stand-in exposing only the methods these functions read.
 */
function link(url: string, isInternal = false): Link {
  return {
    url: () => url,
    isInternal: () => isInternal,
    isLabel: () => !url,
  } as unknown as Link;
}

describe('linkHref', () => {
  beforeEach(() => {
    app.forum.pushAttributes({ baseUrl: 'https://example.com' });
  });

  it('prefixes an internal, root-relative link with the forum base URL', () => {
    expect(linkHref(link('/tags', true))).toBe('https://example.com/tags');
  });

  it('leaves an absolute URL untouched', () => {
    expect(linkHref(link('https://flarum.org'))).toBe('https://flarum.org');
  });

  it('does not prefix a root-relative link that is not marked internal', () => {
    expect(linkHref(link('/tags'))).toBe('/tags');
  });
});

describe('isLinkActive', () => {
  beforeEach(() => {
    app.forum.pushAttributes({ baseUrl: 'https://example.com' });
    m.route.get = () => '/tags';
  });

  it('is never active for an external link', () => {
    expect(isLinkActive(link('https://example.com/tags'))).toBe(false);
  });

  it('is never active for a label', () => {
    expect(isLinkActive(link('', true))).toBe(false);
  });

  it('is active for the current path', () => {
    expect(isLinkActive(link('/tags', true))).toBe(true);
  });

  it('is active for a parent of the current path', () => {
    m.route.get = () => '/tags/support';

    expect(isLinkActive(link('/tags', true))).toBe(true);
  });

  it('does not match on a partial path segment', () => {
    expect(isLinkActive(link('/t', true))).toBe(false);
  });

  it('is not active for the root link on another page', () => {
    expect(isLinkActive(link('/', true))).toBe(false);
  });
});
