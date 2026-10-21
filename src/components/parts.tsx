import type { Header, KeyValue, PreparedRequest } from "@yaakdoc/core";
import { methodLabel, usePageActions, useRunInYaak } from "@yaakdoc/react";
import { cn } from "@/lib/cn";
import { PageActions, RunInYaakButton } from "./islands";

/** Method badge, used everywhere (registered as the `MethodBadge` override, so the nav uses it too). */
export function MethodBadge({
  request,
  className,
}: {
  request: Pick<PreparedRequest, "kind"> & { method?: string | null };
  className?: string;
}) {
  const label = methodLabel(request);

  return (
    <span data-yd="method" data-method={label.toLowerCase()} className={cn("xp-method", className)}>
      {label === "DELETE" ? "DEL" : label === "OPTIONS" ? "OPT" : label}
    </span>
  );
}

/** A two-column table styled as an XP list view in "Details" mode. */
export function KeyValueTable({
  items,
  columns = ["Name", "Value"],
}: {
  items: Array<KeyValue | Header>;
  columns?: [string, string];
}) {
  if (items.length === 0) return null;
  return (
    <div className="xp-listview">
      <table>
        <thead>
          <tr>
            <th className="xp-listview-name">{columns[0]}</th>
            <th>{columns[1]}</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: names can repeat
            <tr key={index}>
              <td className="xp-mono">
                {item.name}

                {!item.enabled ? (
                  <span className="xp-tag" title="Not sent by default">
                    optional
                  </span>
                ) : null}

                {"inheritedFrom" in item && item.inheritedFrom ? (
                  <span
                    className="xp-tag xp-tag-inherited"
                    title={`Inherited from ${item.inheritedFrom.model} "${item.inheritedFrom.name}"`}
                  >
                    {item.inheritedFrom.model === "workspace"
                      ? "workspace"
                      : item.inheritedFrom.name}
                  </span>
                ) : null}
              </td>

              <td className="xp-mono xp-muted">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Run in Yaak" button (when enabled in the config). */
export function RunInYaak({ className }: { className?: string }) {
  const runInYaak = useRunInYaak();
  if (!runInYaak) {
    return null;
  }

  return (
    <div className={className}>
      <RunInYaakButton name={runInYaak.name} dataUrl={runInYaak.dataUrl} />
    </div>
  );
}

/** "Copy page" split button. Rendered only when LLM features are enabled. */
export function CopyPage({
  markdownUrl,
  label = "Copy page",
  className,
}: {
  markdownUrl: string | null;
  /** "Copy page" for the page itself, "Copy section" for sections within a page. */
  label?: string;
  className?: string;
}) {
  const actions = usePageActions(markdownUrl);
  if (!actions) {
    return null;
  }

  return (
    <div className={className}>
      <PageActions
        markdownUrl={actions.markdownUrl}
        absoluteUrl={actions.absoluteUrl}
        openIn={actions.openIn}
        label={label}
      />
    </div>
  );
}
