import {
  createIsland,
  type EnvironmentOption,
  LLM_PROVIDERS,
  type LlmProvider,
  openInUrl,
  openSearch,
  RUN_IN_YAAK_BADGE,
  resolveUrl,
  SearchShortcut,
  useColorMode,
  useCopy,
  useEnvironment,
  useNavToggle,
  useRunInYaakHref,
  useSearch,
  useSearchDialog,
  useSearchShortcutLabel,
} from "@yaakdoc/react/islands";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  DocumentIcon,
  ExternalIcon,
  FolderIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "./icons";

/**
 * Toolbar button switching between Luna (light) and Royale Noir (dark). Both icons are rendered and
 * CSS shows the one for the current mode, so the server render matches before hydration.
 */
export const ThemeToggle = createIsland("winxp:theme-toggle", function ThemeToggle() {
  const { resolved, toggle } = useColorMode();

  const label = resolved === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="xp-toolbar-button xp-color-mode"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <MoonIcon className="xp-color-mode-light" />
      <SunIcon className="xp-color-mode-dark" />
    </button>
  );
});

export const CopyCode = createIsland(
  "winxp:copy-code",
  function CopyCode({ target, className }: { target: string; className?: string }) {
    const { copied, copy } = useCopy();

    return (
      <button
        type="button"
        className={cn("xp-button xp-button-small", className)}
        onClick={() => copy({ target })}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="xp-button-text">{copied ? "Copied" : "Copy"}</span>
      </button>
    );
  },
);

/** Small icon button copying a literal text (e.g. a request URL). */
export const CopyText = createIsland(
  "winxp:copy-text",
  function CopyText({ text, label }: { text: string; label: string }) {
    const { copied, copy } = useCopy();

    return (
      <button
        type="button"
        className="xp-button xp-button-icon"
        onClick={() => copy({ text })}
        aria-label={copied ? "Copied" : label}
        title={copied ? "Copied" : label}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    );
  },
);

/**
 * State for a small XP-style popup menu: closes on Escape and outside clicks, supports arrow keys,
 * and returns focus to the trigger without scrolling (the trigger can sit in a sticky header).
 */
function useMenu() {
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const items = () => [
    ...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
  ];

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const trigger = triggerRef.current;

    if (!open || !menu || !trigger) {
      return;
    }

    delete menu.dataset.align;
    delete menu.dataset.side;

    const rect = menu.getBoundingClientRect();
    const bottom = document.querySelector(".xp-taskbar")?.getBoundingClientRect().top;

    if (rect.left < 8) {
      menu.dataset.align = "start";
    }

    if (
      rect.bottom > (bottom ?? window.innerHeight) - 4 &&
      trigger.getBoundingClientRect().top > rect.height + 8
    ) {
      menu.dataset.side = "top";
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    menuRef.current
      ?.querySelector<HTMLElement>('[role="menuitem"]')
      ?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      close(false);
      return;
    }

    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);

    const next =
      event.key === "ArrowDown"
        ? list[(index + 1) % list.length]
        : event.key === "ArrowUp"
          ? list[(index - 1 + list.length) % list.length]
          : event.key === "Home"
            ? list[0]
            : event.key === "End"
              ? list[list.length - 1]
              : null;

    if (next) {
      event.preventDefault();
      next.focus({ preventScroll: true });
    }
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return {
    open,
    toggle: () => setOpen((value) => !value),
    close,
    rootRef,
    triggerRef,
    menuRef,
    onMenuKeyDown,
    onTriggerKeyDown,
  };
}

export type PageActionsProps = {
  markdownUrl: string;
  /** Absolute Markdown URL when the site URL is known; resolved from the location otherwise. */
  absoluteUrl: string | null;
  openIn: LlmProvider[];
  label?: string;
};

/** "Copy page" split button with an XP context menu of Markdown and "Open in" actions. */
export const PageActions = createIsland(
  "winxp:page-actions",
  function PageActions({
    markdownUrl,
    absoluteUrl,
    openIn,
    label = "Copy page",
  }: PageActionsProps) {
    const { copied, copy } = useCopy();
    const menu = useMenu();

    const menuId = useId();

    const open = (provider: LlmProvider) => {
      const url = absoluteUrl ?? resolveUrl(markdownUrl);
      window.open(openInUrl(provider, url), "_blank", "noopener,noreferrer");
    };

    const run = (action: () => void) => () => {
      action();
      menu.close();
    };

    return (
      <div ref={menu.rootRef} className="xp-split">
        <button
          type="button"
          className="xp-button xp-button-small xp-split-main"
          onClick={() => copy({ url: markdownUrl })}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : label}
        </button>

        <button
          ref={menu.triggerRef}
          type="button"
          className="xp-button xp-button-small xp-split-toggle"
          aria-label="More page actions"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.open ? menuId : undefined}
          onClick={menu.toggle}
          onKeyDown={menu.onTriggerKeyDown}
        >
          <ChevronDownIcon />
        </button>

        {menu.open ? (
          <div
            ref={menu.menuRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-label="Use with AI"
            className="xp-menu"
            onKeyDown={menu.onMenuKeyDown}
          >
            <p className="xp-menu-label">Use with AI</p>

            <button
              type="button"
              role="menuitem"
              className="xp-menu-item"
              onClick={run(() => copy({ url: markdownUrl }))}
            >
              <CopyIcon />
              Copy as Markdown
            </button>

            <a
              href={markdownUrl}
              target="_blank"
              rel="noopener"
              role="menuitem"
              className="xp-menu-item"
              onClick={() => menu.close(false)}
            >
              <DocumentIcon />
              View as Markdown
            </a>

            {openIn.length > 0 ? <hr className="xp-menu-separator" /> : null}

            {openIn.map((provider) => (
              <button
                key={provider}
                type="button"
                role="menuitem"
                className="xp-menu-item"
                onClick={run(() => open(provider))}
              >
                <ExternalIcon />
                Open in {LLM_PROVIDERS[provider].label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

/** Title bar button that opens the task pane on small screens. */
export const MobileNavToggle = createIsland(
  "winxp:mobile-nav",
  function MobileNavToggle({ target }: { target: string }) {
    const { open, setOpen, toggle } = useNavToggle(target);

    return (
      <>
        <button
          type="button"
          className="xp-nav-toggle"
          aria-expanded={open}
          aria-controls={target.replace(/^#/, "")}
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={toggle}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        {open
          ? createPortal(
              <div aria-hidden="true" className="xp-backdrop" onClick={() => setOpen(false)} />,
              document.body,
            )
          : null}
      </>
    );
  },
);

/** XP combo box switching the environment used in examples and the variables table. */
export const EnvironmentMenu = createIsland(
  "winxp:environment",
  function EnvironmentMenu({
    environments,
    defaultId,
  }: {
    environments: EnvironmentOption[];
    defaultId: string;
  }) {
    const { selected, select } = useEnvironment(environments, defaultId);

    const id = useId();

    return (
      <span className="xp-field">
        <label htmlFor={id} className="xp-field-label">
          Environment
        </label>

        <select
          id={id}
          className="xp-select"
          value={selected}
          onChange={(event) => select(event.target.value)}
          title="Environment used for examples"
        >
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.name}
            </option>
          ))}
        </select>
      </span>
    );
  },
);

/** Opens Yaak and prompts to import the documented API. */
export const RunInYaakButton = createIsland(
  "winxp:run-in-yaak",
  function RunInYaakButton({ name, dataUrl }: { name: string; dataUrl: string }) {
    const href = useRunInYaakHref(name, dataUrl);

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        title="Import this API into Yaak"
        className="xp-run-in-yaak"
      >
        <img src={RUN_IN_YAAK_BADGE} alt="Run in Yaak" width={140} height={32} />
      </a>
    );
  },
);

/**
 * Opens the search window: a search box in the task pane (`field`), or Explorer's "Search" button
 * in the toolbar (`toolbar`).
 */
export const SearchButton = createIsland(
  "winxp:search-button",
  function SearchButton({ variant = "field" }: { variant?: "field" | "toolbar" }) {
    const shortcut = useSearchShortcutLabel();

    if (variant === "toolbar") {
      return (
        <button
          type="button"
          className="xp-toolbar-button xp-toolbar-search"
          title={`Search (${shortcut})`}
          aria-haspopup="dialog"
          onClick={openSearch}
        >
          <SearchIcon />
          <span className="xp-toolbar-search-text">Search</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        className="xp-search xp-search-trigger"
        aria-haspopup="dialog"
        onClick={openSearch}
      >
        <SearchIcon />
        <span className="xp-search-placeholder">Search</span>
        <kbd className="xp-kbd">
          <SearchShortcut />
        </kbd>
      </button>
    );
  },
);

const KIND_LABELS = { page: "Pages", folder: "Folders", request: "Endpoints" } as const;

/**
 * Search over page, folder and request titles and descriptions, in an XP window (a native modal
 * `<dialog>`) with the results as a list view in "Show in Groups" mode. Opened by
 * {@link SearchButton}, Cmd+K / Ctrl+K and `/`.
 */
export const SearchWindow = createIsland(
  "winxp:search",
  function SearchWindow({ url }: { url: string }) {
    const { open, setOpen, restoreFocus } = useSearchDialog();
    const search = useSearch(url, { enabled: open });

    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const id = useId();

    useEffect(() => {
      const dialog = dialogRef.current;

      if (open && dialog && !dialog.open) {
        dialog.showModal();
        inputRef.current?.focus();
      } else if (!open && dialog?.open) {
        dialog.close();
      }
    }, [open]);

    // Keep the highlighted result in view while moving with the arrow keys.
    useEffect(() => {
      listRef.current
        ?.querySelector(`[data-index="${search.active}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [search.active]);

    // Escape, the close button, a backdrop click and the shortcut all end here.
    const onClose = () => {
      setOpen(false);
      search.setQuery("");
      restoreFocus();
    };

    // One group per kind (in the order the kinds first appear), best matches first in each.
    const kinds = [...new Set(search.results.map((entry) => entry.kind))];
    const grouped = kinds.flatMap((kind) => search.results.filter((entry) => entry.kind === kind));

    // ↑ and ↓ follow the groups; Enter is left to `useSearch` (it opens the active result).
    const onKeyDown = (event: React.KeyboardEvent) => {
      // A search field with text uses Escape to clear itself, and the dialog wouldn't close.
      if (event.key === "Escape") {
        event.preventDefault();
        dialogRef.current?.close();
        return;
      }

      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && grouped.length > 0) {
        event.preventDefault();

        const position = grouped.indexOf(search.results[search.active]!);
        const step = event.key === "ArrowDown" ? 1 : -1;
        const next = grouped[(position + step + grouped.length) % grouped.length]!;

        search.setActive(search.results.indexOf(next));
        return;
      }

      search.onKeyDown(event);
    };

    const query = search.query.trim();

    const status = !query
      ? "Type a title, a method or a word from the description."
      : search.results.length > 0
        ? `${search.results.length} ${search.results.length === 1 ? "result" : "results"}`
        : search.loading
          ? "Searching..."
          : search.error
            ? "Search is unavailable right now."
            : `No results for “${query}”.`;

    return (
      // Clicks outside the window land on the dialog itself (its ::backdrop). Escape closes it natively.
      // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users close it with Escape
      <dialog
        ref={dialogRef}
        className="xp-search-dialog"
        aria-labelledby={`${id}-title`}
        onClose={onClose}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
      >
        <div className="xp-window">
          <div className="xp-window-title">
            <SearchIcon />

            <span id={`${id}-title`} className="xp-window-title-text">
              Search Results
            </span>

            <button
              type="button"
              className="xp-control xp-control-close xp-search-close"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
            />
          </div>

          <div className="xp-window-body xp-search-body">
            <label htmlFor={`${id}-input`} className="xp-search-label">
              Search for pages and endpoints:
            </label>

            <div className="xp-search">
              <SearchIcon />

              <input
                ref={inputRef}
                id={`${id}-input`}
                type="search"
                className="xp-search-input"
                value={search.query}
                onChange={(event) => search.setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                role="combobox"
                aria-controls={`${id}-results`}
                aria-expanded={search.results.length > 0}
                aria-activedescendant={
                  search.results.length > 0 ? `${id}-result-${search.active}` : undefined
                }
              />
            </div>

            <div
              ref={listRef}
              id={`${id}-results`}
              role="listbox"
              aria-label="Results"
              className="xp-listview xp-search-results"
            >
              {grouped.map((entry, position) => {
                const index = search.results.indexOf(entry);
                const heading =
                  grouped[position - 1]?.kind !== entry.kind ? KIND_LABELS[entry.kind] : null;

                return (
                  <div key={entry.href} role="presentation">
                    {heading ? (
                      <p role="presentation" className="xp-search-group">
                        {heading}
                      </p>
                    ) : null}

                    <a
                      href={entry.href}
                      id={`${id}-result-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={index === search.active}
                      className="xp-search-result"
                      onMouseMove={() => search.setActive(index)}
                      onClick={() => dialogRef.current?.close()}
                    >
                      {entry.kind === "request" && entry.method ? (
                        <MethodLabel method={entry.method} />
                      ) : entry.kind === "folder" ? (
                        <FolderIcon />
                      ) : (
                        <DocumentIcon />
                      )}

                      <span className="xp-search-result-text">
                        <span className="xp-search-result-title">{entry.title}</span>

                        {entry.description || entry.section ? (
                          <span className="xp-search-result-detail">
                            {entry.section
                              ? `${entry.section}${entry.description ? " · " : ""}`
                              : ""}
                            {entry.description}
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xp-statusbar">
            <p className="xp-statusbar-pane xp-statusbar-main" role="status">
              {status}
            </p>
          </div>
        </div>
      </dialog>
    );
  },
);

/** Method badge from a label (search results only carry the label). */
function MethodLabel({ method }: { method: string }) {
  return (
    <span data-yd="method" data-method={method.toLowerCase()} className="xp-method">
      {method === "DELETE" ? "DEL" : method === "OPTIONS" ? "OPT" : method}
    </span>
  );
}
