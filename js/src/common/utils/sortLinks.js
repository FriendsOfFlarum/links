export default function sortLinks(links) {
  return links.slice(0).sort((a, b) => {
    const aPos = a.position();
    const bPos = b.position();
    return aPos > bPos ? 1 : aPos < bPos ? -1 : 0;
  });
}
