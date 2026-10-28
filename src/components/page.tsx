import { flattenNavigation } from "@yaakdoc/core";
import {
  Markdown,
  type PageDocProps,
  useDocument,
  usePageDoc,
  usePageNeighbors,
} from "@yaakdoc/react";
import {
  BookIcon,
  ClockIcon,
  DocumentIcon,
  ExternalIcon,
  FolderIcon,
  HomeIcon,
  KeyIcon,
  ListIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  TerminalIcon,
} from "./icons";
import { CopyPage } from "./parts";

/** XP icons for the words of Lucide-style icon names (`key-round`, `book-open`, `history`, ...). */
const ICONS: Array<[RegExp, typeof DocumentIcon]> = [
  [/^(key|lock|shield|fingerprint)/, KeyIcon],
  [/^(book|library|graduation|help|lifebuoy)/, BookIcon],
  [/^(terminal|code|braces|command|server|database|webhook|api|plug)/, TerminalIcon],
  [/^(history|clock|calendar|timer|hourglass|alarm)/, ClockIcon],
  [/^(house|home)/, HomeIcon],
  [/^folder/, FolderIcon],
  [/^(list|table|layout|rows|logs)/, ListIcon],
  [/^(search|scan)/, SearchIcon],
  [/^(globe|earth|link|external|compass|map)/, ExternalIcon],
  [/^sun/, SunIcon],
  [/^moon/, MoonIcon],
];

/**
 * Icon of a page, group or tab. Names are Lucide-style (`book-open`, `BookOpen`); the XP icon set is
 * small, so names are matched by their words, and anything else gets a document icon.
 */
export function NavIcon({
  name,
  size = 16,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .split(/[-_\s]+/);

  const Icon = ICONS.find(([pattern]) => words.some((word) => pattern.test(word)))?.[1];

  return Icon ? (
    <Icon size={size} className={className} />
  ) : (
    <DocumentIcon size={size} className={className} />
  );
}

/** The tab and groups containing a page, as a breadcrumb trail. */
function usePageTrail(id: string): string[] {
  const { navigation } = useDocument();

  const entry = flattenNavigation(navigation).find(
    (item) => item.target.type === "page" && item.target.id === id,
  );

  if (!entry) {
    return [];
  }

  return [...(entry.tab.title ? [entry.tab.title] : []), ...entry.groups];
}

/** A custom Markdown page, with the same heading as the overview. */
export function PageSection({ id }: PageDocProps) {
  const page = usePageDoc(id);
  const trail = usePageTrail(id);

  return (
    <article className="xp-page">
      <div className="xp-page-head">
        <span className="xp-page-head-icon">
          {page.icon ? <NavIcon name={page.icon} size={48} /> : <DocumentIcon size={48} />}
        </span>

        <div className="xp-page-head-text">
          {trail.length > 0 ? <p className="xp-breadcrumbs">{trail.join(" › ")}</p> : null}

          <h1 className="xp-page-title">{page.title}</h1>

          {page.description ? <p className="xp-page-description">{page.description}</p> : null}
        </div>

        <CopyPage markdownUrl={page.markdownUrl} className="xp-page-actions" />
      </div>

      <Markdown html={page.html} className="xp-prose" />

      <PageNav id={id} />
    </article>
  );
}

/** Previous and next pages as a wizard's "< Back" and "Next >" buttons. */
export function PageNav({ id }: { id: string }) {
  const { previous, next } = usePageNeighbors(id);

  if (!previous && !next) {
    return null;
  }

  return (
    <nav aria-label="Pages" className="xp-pagenav">
      {previous ? (
        <a href={previous.href} rel="prev" className="xp-button xp-pagenav-link">
          <span className="xp-pagenav-direction">&lt; Back</span>
          <span className="xp-pagenav-title">{previous.title}</span>
        </a>
      ) : null}

      {next ? (
        <a href={next.href} rel="next" className="xp-button xp-pagenav-link xp-pagenav-next">
          <span className="xp-pagenav-direction">Next &gt;</span>
          <span className="xp-pagenav-title">{next.title}</span>
        </a>
      ) : null}
    </nav>
  );
}
