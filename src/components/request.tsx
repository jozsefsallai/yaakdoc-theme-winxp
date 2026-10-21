import { formFieldValue, grpcMethodPath, methodLabel, type PreparedRequest } from "@yaakdoc/core";
import {
  AuthInfo,
  copyActionLabel,
  EnvironmentVariants,
  Heading,
  Html,
  Markdown,
  RequestUrl,
  statusClass,
  useThemeOptions,
} from "@yaakdoc/react";
import {
  TabList,
  type TabListProps,
  tabGroupIds,
  tabPanelProps,
  visibleTabPanelSelector,
} from "@yaakdoc/react/islands";
import { cn } from "@/lib/cn";
import type { WinXPOptions } from "../../theme";
import { DocumentIcon, ListIcon } from "./icons";
import { CopyCode, CopyText } from "./islands";
import { CopyPage, KeyValueTable } from "./parts";

/** An XP group box: an etched frame with its title cut into the top border. */
export function GroupBox({
  title,
  aside,
  id,
  children,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="xp-groupbox">
      <h4 className="xp-groupbox-title" id={id}>
        {title}
        {aside ? <span className="xp-groupbox-aside">{aside}</span> : null}
      </h4>

      {children}
    </div>
  );
}

function Body({ request }: { request: PreparedRequest }) {
  if (request.kind === "http") {
    const { body } = request;
    if (body.type === "none") {
      return null;
    }

    return (
      <GroupBox
        title="Body"
        aside={body.contentType ? <code className="xp-mono">{body.contentType}</code> : null}
      >
        {body.type === "form-urlencoded" || body.type === "multipart" ? (
          <KeyValueTable
            columns={["Field", "Value"]}
            items={body.fields.map((field) => ({
              ...field,
              value: formFieldValue(field),
            }))}
          />
        ) : body.type === "binary" ? (
          <p className="xp-muted">
            Binary file {body.filePath ? <code className="xp-mono">{body.filePath}</code> : null}
          </p>
        ) : request.bodyHtml ? (
          <div className="xp-sunken xp-code">
            <Html html={request.bodyHtml} />

            {request.variablesHtml ? (
              <div className="xp-code-variables">
                <p className="xp-code-caption">Variables</p>

                <Html html={request.variablesHtml ?? ""} />
              </div>
            ) : null}
          </div>
        ) : null}
      </GroupBox>
    );
  }

  if (!request.bodyHtml) {
    return null;
  }

  return (
    <GroupBox title="Message">
      <div className="xp-sunken xp-code">
        <Html html={request.bodyHtml} />
      </div>
    </GroupBox>
  );
}

/** A small Notepad-like window with XP tabs, shared by the code examples and example responses. */
function TabbedPanel({
  kind,
  group,
  label,
  tabs,
  sync,
  className,
  children,
}: {
  kind: "code-examples" | "response-examples";
  group: string;
  label: string;
  tabs: TabListProps["tabs"];
  sync?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={label}
      data-yd={kind}
      data-yd-tab-group={group}
      className={cn("xp-window xp-panel", className)}
    >
      <div className="xp-window-title">
        {kind === "code-examples" ? <DocumentIcon /> : <ListIcon />}
        <span className="xp-window-title-text">{label}</span>
      </div>

      <div className="xp-window-body xp-panel-body">
        <div className="xp-tabstrip">
          <TabList
            group={group}
            tabs={tabs}
            label={label}
            {...(sync === false ? { sync } : {})}
            className="xp-tabs"
            tabClassName="xp-tab"
          />

          <CopyCode target={visibleTabPanelSelector(group)} className="xp-tabstrip-copy" />
        </div>

        <div className="xp-tabpage">{children}</div>
      </div>
    </section>
  );
}

/** Tabbed code examples (one set per environment). */
export function CodePanel({
  request,
  className,
}: {
  request: PreparedRequest;
  className?: string;
}) {
  if (request.examples.length === 0) {
    return null;
  }

  const group = tabGroupIds.examples(request.anchor);

  return (
    <TabbedPanel
      kind="code-examples"
      group={group}
      label="Example request"
      tabs={request.examples.map((example) => ({ id: example.id, label: example.label }))}
      {...(className ? { className } : {})}
    >
      <EnvironmentVariants variants={request.variants}>
        {(variant, variantIndex) =>
          variant.examples.map((example, index) => (
            <div
              key={example.id}
              {...tabPanelProps(group, example.id, {
                selected: index === 0,
                variant: variantIndex,
              })}
              className="xp-tabpanel xp-code"
            >
              <Html html={example.html} />
            </div>
          ))
        }
      </EnvironmentVariants>
    </TabbedPanel>
  );
}

/** Example responses from ```response:<status> blocks, tabbed by status. */
export function ResponsePanel({
  request,
  className,
}: {
  request: PreparedRequest;
  className?: string;
}) {
  if (request.responses.length === 0) {
    return null;
  }

  const group = tabGroupIds.responses(request.anchor);

  return (
    <TabbedPanel
      kind="response-examples"
      group={group}
      label="Example response"
      sync={false}
      tabs={request.responses.map((response, index) => {
        const status = statusClass(response.status);

        return {
          id: String(index),
          label: response.label,
          className: cn("xp-tab-status", status && `xp-status-${status}`),
        };
      })}
      {...(className ? { className } : {})}
    >
      {request.responses.map((response, index) => (
        <div
          key={String(index)}
          {...tabPanelProps(group, String(index), { selected: index === 0 })}
          data-status={response.status ?? undefined}
          className="xp-tabpanel xp-code"
        >
          {response.empty ? (
            <p className="xp-empty">No response body</p>
          ) : (
            <Html html={response.html} />
          )}
        </div>
      ))}
    </TabbedPanel>
  );
}

export function RequestSection({
  request,
  level = 3,
}: {
  request: PreparedRequest;
  level?: number;
}) {
  const options = useThemeOptions<WinXPOptions>();

  const headers = request.kind === "grpc" ? request.metadata : request.headers;
  const side = options.codePanel === "right";

  return (
    <section
      id={request.anchor}
      data-yd-section
      data-yd="request"
      className={cn("xp-request", side && "xp-request-side")}
    >
      <article className="xp-window xp-request-window">
        <div className="xp-window-title">
          <DocumentIcon />

          <Heading level={level} className="xp-window-title-text">
            <a href={`#${request.anchor}`}>{request.name}</a>
          </Heading>
        </div>

        <div className="xp-window-body">
          <div className="xp-request-meta">
            {request.breadcrumbs.length > 0 ? (
              <p className="xp-breadcrumbs">
                {request.breadcrumbs.map((crumb) => crumb.name).join(" › ")}
              </p>
            ) : (
              <span />
            )}

            <CopyPage markdownUrl={request.markdownUrl} label={copyActionLabel(level)} />
          </div>

          {/* Request line: method segment | URL | copy */}
          <div data-method={methodLabel(request).toLowerCase()} className="xp-request-line">
            <span className="xp-request-method">{methodLabel(request)}</span>

            <EnvironmentVariants variants={request.variants}>
              {(variant) => (
                <>
                  <RequestUrl url={variant.url} className="xp-request-url" />

                  <span className="xp-request-copy">
                    <CopyText text={variant.resolvedUrl} label="Copy URL" />
                  </span>
                </>
              )}
            </EnvironmentVariants>
          </div>

          {request.kind === "grpc" && (request.service || request.method) ? (
            <p className="xp-mono xp-muted xp-grpc-path">{grpcMethodPath(request)}</p>
          ) : null}

          {request.descriptionHtml ? (
            <Markdown html={request.descriptionHtml} className="xp-prose" />
          ) : null}

          <GroupBox title="Authentication">
            <AuthInfo auth={request.auth} className="xp-auth" />
          </GroupBox>

          {request.kind !== "grpc" && request.pathParameters.length > 0 ? (
            <GroupBox title="Path parameters">
              <KeyValueTable items={request.pathParameters} />
            </GroupBox>
          ) : null}

          {request.kind !== "grpc" && request.queryParameters.length > 0 ? (
            <GroupBox title="Query parameters">
              <KeyValueTable items={request.queryParameters} />
            </GroupBox>
          ) : null}

          {headers.length > 0 ? (
            <GroupBox title={request.kind === "grpc" ? "Metadata" : "Headers"}>
              <KeyValueTable items={headers} />
            </GroupBox>
          ) : null}

          <Body request={request} />

          {!side ? (
            <div className="xp-panels xp-panels-inline">
              <CodePanel request={request} />
              <ResponsePanel request={request} />
            </div>
          ) : null}
        </div>
      </article>

      {side ? (
        <div className="xp-request-aside">
          <div className="xp-panels">
            <CodePanel request={request} />
            <ResponsePanel request={request} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
