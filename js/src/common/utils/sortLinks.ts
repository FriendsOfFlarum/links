import type Link from '../models/Link';

export default function sortLinks(links: Link[]): Link[] {
  return links.slice(0).sort((a, b) => {
    const aPos = a.position() ?? 0;
    const bPos = b.position() ?? 0;
    return aPos - bPos;
  });
}
