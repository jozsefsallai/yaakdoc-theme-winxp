import { defineTheme } from "@yaakdoc/react/theme";
import { z } from "zod";

export const winxpOptions = z.object({
  /** Luna color scheme: "blue" (Default), "olive" (Olive Green) or "silver". */
  scheme: z.enum(["blue", "olive", "silver"]).default("blue"),
  /** Where code examples go: a sticky column next to each request, or inline below it. */
  codePanel: z.enum(["right", "inline"]).default("right"),
  /** Task pane (sidebar) width (any CSS length). */
  sidebarWidth: z.string().default("17rem"),
  /** Folder levels expanded in the navigation by default (folders containing the current page always are). */
  navOpenDepth: z.number().int().min(0).default(1),
  /** Show the environment in the toolbar. */
  showEnvironment: z.boolean().default(true),
  /** Show the (decorative) minimize, maximize and close buttons in the title bar. */
  windowControls: z.boolean().default(true),
});

export type WinXPOptions = z.output<typeof winxpOptions>;

export default defineTheme({
  name: "winxp",
  entry: "./src/entry.tsx",
  client: "./src/client.ts",
  styles: ["./src/styles.css"],
  // Light mode is Luna, dark mode is Royale Noir.
  highlight: { light: "light-plus", dark: "dark-plus" },
  options: winxpOptions,
  eject: {
    files: ["theme.ts", "src/**", "tsconfig.json", "README.md"],
    dependencies: ["@yaakdoc/react", "@yaakdoc/core", "zod"],
  },
});
