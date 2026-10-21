# yaakdoc-theme-winxp

A [yaakdoc](https://github.com/jozsefsallai/yaakdoc#readme) theme inspired by the Windows XP Luna visual style.

**DEMO: https://yaakdoc-theme-winxp.vercel.app**

## Installation

```sh
npm i -D yaakdoc yaakdoc-theme-winxp
```

Then set the theme in `yaakdoc.config.json`:

```json
{
  "theme": "winxp"
}
```

## Options

```json
{
  "theme": "winxp",
  "themeOptions": {
    "scheme": "blue",
    "codePanel": "right",
    "sidebarWidth": "17rem",
    "navOpenDepth": 1,
    "showEnvironment": true,
    "windowControls": true
  }
}
```

| Option | Default | Description |
| --- | --- | --- |
| `scheme` | `"blue"` | Luna color scheme for light mode: `"blue"`, `"olive"` or `"silver"`. Dark mode always uses Royale Noir. |
| `codePanel` | `"right"` | `"right"` puts code examples in a sticky column on wide screens. `"inline"` puts them below each request. |
| `sidebarWidth` | `"17rem"` | Width of the task pane (any CSS length). |
| `navOpenDepth` | `1` | Folder levels expanded in the navigation by default. Folders containing the current page always open. |
| `showEnvironment` | `true` | Show the environment used for the examples in the toolbar. |
| `windowControls` | `true` | Show the decorative minimize, maximize and close buttons in the title bar. |

## Customizing

- **Colors.** `branding.colors.primary` replaces the scheme's link and selection color, and `branding.colors.accent` replaces the color of hovered task pane links.
- **Fonts.** The theme uses system fonts: Tahoma and Trebuchet MS for the UI, and Lucida Console for code. Other fonts are used where those aren't installed. `branding.fonts` overrides them.
- **Color mode.** Light mode uses the chosen Luna scheme, and dark mode uses Royale Noir. `branding.defaultColorMode` and `branding.colorModeToggle` work as usual. The toggle is a sun/moon button in the toolbar. Per-mode branding colors (`branding.colors.light` / `.dark`) apply to each mode.
- **Everything else.** Use `branding.customCss`, or run `npx yaakdoc eject` to copy the theme into your project.

## Development

```sh
pnpm install
pnpm dev           # dev server for the example docs in ./example
pnpm build         # static build of the example into ./example/dist
pnpm check-types
pnpm lint
```

## Disclaimer

This project isn't affiliated with or endorsed by Microsoft. Windows and Windows XP are trademarks of Microsoft Corporation. The theme recreates the look of the Luna visual style with original CSS and SVG artwork and contains no Microsoft assets.

## License

MIT
