import { findFolderNode, type TreeNode } from "@yaakdoc/core";
import {
  AuthInfo,
  Content,
  copyActionLabel,
  EnvironmentVariants,
  Heading,
  type LayoutProps,
  Logo,
  Markdown,
  NavTree,
  TreeContent,
  useDocument,
  usePage,
  useRunInYaak,
  useSite,
  useThemeOptions,
} from "@yaakdoc/react";
import { NavFilter, ScrollSpy } from "@yaakdoc/react/islands";
import { cn } from "@/lib/cn";
import type { WinXPOptions } from "../../theme";
import {
  DocumentIcon,
  ErrorIcon,
  ExternalIcon,
  FolderIcon,
  KeyIcon,
  ListIcon,
  SearchIcon,
} from "./icons";
import { EnvironmentMenu, MobileNavToggle, ThemeToggle } from "./islands";
import { CopyPage, KeyValueTable, RunInYaak } from "./parts";
import { GroupBox, RequestSection } from "./request";

const SIDEBAR_ID = "winxp-taskpane";

function TitleBar() {
  const site = useSite();
  const options = useThemeOptions<WinXPOptions>();

  return (
    <div className="xp-titlebar">
      <MobileNavToggle target={`#${SIDEBAR_ID}`} />

      {/* The site logo (or a document icon) plus the title, as the window caption. */}
      {!site.logo ? (
        <span className="xp-caption-icon" aria-hidden="true">
          <DocumentIcon />
        </span>
      ) : null}

      <Logo className="xp-caption" />

      {options.windowControls ? (
        <span className="xp-window-controls" aria-hidden="true">
          <span className="xp-control xp-control-minimize" />
          <span className="xp-control xp-control-maximize" />
          <span className="xp-control xp-control-close" />
        </span>
      ) : null}
    </div>
  );
}

/** Explorer's toolbar row: an address bar, the environment combo box and the site links. */
function Toolbar() {
  const site = useSite();
  const page = usePage();
  const document = useDocument();
  const options = useThemeOptions<WinXPOptions>();

  const address = `${site.url ? site.url.replace(/\/$/, "") : ""}${page.path}`;

  return (
    <div className="xp-toolbar">
      <span className="xp-field xp-address">
        <span className="xp-field-label">Address</span>

        <span className="xp-address-box">
          <DocumentIcon />
          <span className="xp-address-text">{address}</span>
        </span>
      </span>

      {options.showEnvironment && document.environments.length > 1 ? (
        <EnvironmentMenu
          environments={document.environments}
          defaultId={document.environments[0]!.id}
        />
      ) : options.showEnvironment && document.environment ? (
        <span className="xp-field" title="Environment used for examples">
          <span className="xp-field-label">Environment</span>
          <span className="xp-select xp-select-static">{document.environment.name}</span>
        </span>
      ) : null}

      {site.links.length > 0 ? (
        <span className="xp-toolbar-links">
          {site.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="xp-toolbar-button"
              {...(/^https?:/.test(link.href) ? { target: "_blank", rel: "noopener" } : {})}
            >
              {link.label}
            </a>
          ))}
        </span>
      ) : null}

      <RunInYaak className="xp-toolbar-yaak" />

      {site.colorModeToggle ? <ThemeToggle /> : null}
    </div>
  );
}

/** Explorer's left task pane: a search box and the navigation, top-level folders as task groups. */
function TaskPane() {
  const site = useSite();
  const runInYaak = useRunInYaak();
  const options = useThemeOptions<WinXPOptions>();

  return (
    <aside id={SIDEBAR_ID} aria-label="Navigation" className="xp-taskpane">
      <div className="xp-taskpane-scroll">
        <div className="xp-taskgroup xp-taskgroup-special">
          <div className="xp-taskgroup-header">
            <span>{site.title}</span>
          </div>

          <div className="xp-taskgroup-body">
            <div className="xp-search">
              <SearchIcon />
              <NavFilter
                target={`#${SIDEBAR_ID} [data-yd=nav]`}
                placeholder="Search requests"
                className="xp-search-input"
              />
            </div>

            <a href={site.base} className="xp-task-link">
              <ListIcon />
              Overview
            </a>
          </div>
        </div>

        {/* The toolbar's links, for small screens where they don't fit in the toolbar. */}
        {site.links.length > 0 || runInYaak ? (
          <div className="xp-taskgroup xp-taskgroup-places">
            <div className="xp-taskgroup-header">
              <span>Other Places</span>
            </div>

            <div className="xp-taskgroup-body">
              {site.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="xp-task-link"
                  {...(/^https?:/.test(link.href) ? { target: "_blank", rel: "noopener" } : {})}
                >
                  <ExternalIcon />
                  {link.label}
                </a>
              ))}

              <RunInYaak className="xp-task-yaak" />
            </div>
          </div>
        ) : null}

        <NavTree className="xp-nav" openDepth={options.navOpenDepth} />
      </div>
    </aside>
  );
}

function Overview() {
  const document = useDocument();
  const site = useSite();
  const page = usePage();

  return (
    <section id="overview" className="xp-overview">
      <div className="xp-page-head">
        <span className="xp-page-head-icon">
          <DocumentIcon size={48} />
        </span>

        <div className="xp-page-head-text">
          <h1 className="xp-page-title">{site.title}</h1>

          {site.description && !document.workspace.descriptionHtml ? (
            <p className="xp-page-description">{site.description}</p>
          ) : null}
        </div>

        <CopyPage markdownUrl={page.markdownUrl} className="xp-page-actions" />
      </div>

      {document.workspace.descriptionHtml ? (
        <Markdown html={document.workspace.descriptionHtml} className="xp-prose" />
      ) : null}

      {document.workspace.auth ? (
        <GroupBox
          id="authentication-overview"
          title={
            <>
              <KeyIcon /> Authentication
            </>
          }
        >
          <AuthInfo auth={document.workspace.auth} className="xp-auth" />
        </GroupBox>
      ) : null}

      {site.showVariables && document.variables.length > 0 ? (
        <GroupBox
          id="variables"
          title={
            <>
              <ListIcon /> Variables
            </>
          }
          aside={document.environment ? document.environment.name : null}
        >
          <EnvironmentVariants variants={document.variableSets}>
            {(set) => <KeyValueTable items={set.variables} />}
          </EnvironmentVariants>
        </GroupBox>
      ) : null}
    </section>
  );
}

function FolderSection({
  id,
  level,
  nested = true,
}: {
  id: string;
  level: number;
  nested?: boolean;
}) {
  const document = useDocument();

  const folder = document.folders[id];
  if (!folder) {
    return null;
  }

  const node = findFolderNode(document.tree, id);

  return (
    <section id={folder.anchor} data-yd-section className={cn("xp-folder", `xp-folder-${level}`)}>
      <div className="xp-folder-head">
        <FolderIcon size={level <= 2 ? 32 : 24} />

        <div className="xp-folder-head-text">
          {folder.breadcrumbs.length > 0 ? (
            <p className="xp-breadcrumbs">
              {folder.breadcrumbs.map((crumb) => crumb.name).join(" › ")}
            </p>
          ) : null}

          <Heading level={level} className="xp-folder-title">
            <a href={`#${folder.anchor}`}>{folder.name}</a>
          </Heading>
        </div>

        <CopyPage markdownUrl={folder.markdownUrl} label={copyActionLabel(level)} />
      </div>

      {folder.descriptionHtml ? (
        <Markdown html={folder.descriptionHtml} className="xp-prose" />
      ) : null}

      {nested && node ? <TreeContent nodes={node.children} level={level + 1} /> : null}
    </section>
  );
}

/** Child folders and requests as an Explorer "Tiles" view. */
function ChildLinks({ nodes }: { nodes: TreeNode[] }) {
  const document = useDocument();

  return (
    <ul className="xp-tiles">
      {nodes.map((node) => {
        const item =
          node.type === "folder" ? document.folders[node.id] : document.requests[node.id];

        if (!item) {
          return null;
        }

        return (
          <li key={node.id}>
            <a href={item.href} className="xp-tile">
              {node.type === "folder" ? <FolderIcon size={40} /> : <DocumentIcon size={40} />}

              <span className="xp-tile-text">
                <span className="xp-tile-name">{item.name}</span>

                {item.summary ? <span className="xp-tile-summary">{item.summary}</span> : null}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** The 404 page, as an XP error dialog. */
function NotFound() {
  const site = useSite();

  return (
    <section className="xp-notfound">
      <div className="xp-window xp-dialog" role="alertdialog" aria-labelledby="xp-notfound-title">
        <div className="xp-window-title">
          <span className="xp-window-title-text">{site.title}</span>
        </div>

        <div className="xp-window-body xp-dialog-body">
          <ErrorIcon size={40} />

          <div>
            <h1 id="xp-notfound-title" className="xp-dialog-title">
              This page doesn't exist
            </h1>

            <p>
              It may have been renamed or removed from the workspace. Check the address and try
              again.
            </p>
          </div>
        </div>

        <div className="xp-dialog-buttons">
          <a href={site.base} className="xp-button xp-button-default">
            OK
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * The theme's versions of the base content components. yaakdoc's `<Content>` decides what a page
 * shows (everything, a folder, a request, a 404); these overrides decide how it looks.
 */
export const contentComponents = {
  Overview,
  FolderDoc: FolderSection,
  RequestDoc: RequestSection,
  ChildLinks,
  NotFound,
};

/** The window's status bar: the footer text, or the workspace name and export date. */
function StatusBar() {
  const site = useSite();
  const document = useDocument();

  return (
    <div className="xp-statusbar">
      <div className="xp-statusbar-pane xp-statusbar-main">
        {site.footerHtml ? (
          <Markdown html={site.footerHtml} className="xp-statusbar-text" />
        ) : (
          <p className="xp-statusbar-text">{document.workspace.name}</p>
        )}
      </div>

      {document.exportedAt ? (
        <div className="xp-statusbar-pane">
          Exported {new Date(document.exportedAt).toLocaleDateString("en", { dateStyle: "medium" })}
        </div>
      ) : null}
    </div>
  );
}

/** The taskbar: a "start" button back to the overview, this window's button and the tray. */
function Taskbar() {
  const site = useSite();
  const document = useDocument();

  // The site's icon on the start button, or a plain orb when there is none.
  const icon = site.favicon ?? site.logo?.light ?? site.logo?.dark ?? null;

  return (
    <footer className="xp-taskbar">
      <a href={site.base} className="xp-start">
        {icon ? (
          <img src={icon} alt="" className="xp-start-icon" />
        ) : (
          <span className="xp-start-orb" aria-hidden="true" />
        )}
        start
      </a>

      <span className="xp-taskbar-tasks">
        <span className="xp-task-button">
          <DocumentIcon />
          <span className="xp-task-button-text">{document.workspace.name}</span>
        </span>
      </span>

      <span className="xp-tray">
        {site.llms.txtUrl ? <a href={site.llms.txtUrl}>llms.txt</a> : null}
        <span>Built with yaakdoc</span>
      </span>
    </footer>
  );
}

export function Layout({ page }: LayoutProps) {
  const options = useThemeOptions<WinXPOptions>();

  return (
    <div
      className="xp-root"
      data-xp-scheme={options.scheme}
      style={{ "--sidebar-width": options.sidebarWidth } as React.CSSProperties}
    >
      <a href="#content" className="xp-skip-link">
        Skip to content
      </a>

      <header className="xp-chrome">
        <TitleBar />
        <Toolbar />
      </header>

      <div className="xp-workspace">
        <TaskPane />

        <div className="xp-main">
          <Content className="xp-content" />
          <StatusBar />
        </div>
      </div>

      <Taskbar />

      {page.kind === "index" ? <ScrollSpy target={`#${SIDEBAR_ID}`} /> : null}
    </div>
  );
}
