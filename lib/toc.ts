export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Extract all h2/h3/h4 headings from an HTML string. */
export function parseHeadings(html: string): TocItem[] {
  const regex = /<h([234])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const items: TocItem[] = [];
  const slugCount: Record<string, number> = {};
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]) as 2 | 3 | 4;
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    const base = slugify(text) || `heading-${items.length + 1}`;
    const count = slugCount[base] ?? 0;
    const id = count === 0 ? base : `${base}-${count}`;
    slugCount[base] = count + 1;

    items.push({ id, text, level });
  }
  return items;
}

/** Inject id="" attributes into h2/h3/h4 tags that don't already have one. */
export function injectHeadingIds(html: string): string {
  const slugCount: Record<string, number> = {};
  return html.replace(/<h([234])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const base = slugify(text) || `heading`;
    const count = slugCount[base] ?? 0;
    const id = count === 0 ? base : `${base}-${count}`;
    slugCount[base] = count + 1;

    if (/\bid=/.test(attrs)) return `<h${lvl}${attrs}>${inner}</h${lvl}>`;
    return `<h${lvl} id="${id}"${attrs}>${inner}</h${lvl}>`;
  });
}
