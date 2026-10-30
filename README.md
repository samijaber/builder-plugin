# @samijaber/builder-plugin

Personal Builder.io plugin that customizes the Builder UI.

## Features

- **Agent first**: when a Fusion project opens, the Agent tab is selected instead of Interact. Applies once per project per page load, so you can still switch tabs freely. Requires the Agent tab to be enabled for the project (feature flag or the project's Agent mode setting).

## Install

In Builder, go to Account Settings > Plugins and add:

```
https://unpkg.com/@samijaber/builder-plugin/dist/plugin.system.js
```

Builder rejects bare package names ("bad url") unless they start with `@builder.io/` or are in its curated plugin library, so use the full URL. This unpinned URL always resolves to the latest release and is cached for only a few minutes. Avoid the jsDelivr equivalent, which caches unpinned URLs for up to 12 hours on the CDN and 7 days in browsers. URL plugins also need the `privatePlugins` feature on the org.

Plugins are installed per organization, so every member's browser loads the code. This plugin only acts when the signed-in user's id matches `OWNER_USER_ID` in `src/index.ts`; for everyone else it does nothing.

## Develop

```bash
npm install
npm run build   # outputs dist/plugin.system.js (SystemJS format)
npm run dev     # rebuild on change
```

To try a local build, serve `dist/` over HTTP and load it with the plugin override that Builder reads from the URL or `sessionStorage` (`load.plugin.*`).

## Add a customization

Plugins run inside the Builder app and can import the host's `@builder.io/app-context` (the app state) and `mobx`. Add a module under `src/` and call it from `src/index.ts`.

## Publish

```bash
npm login        # once
npm run release  # patch bump (default)
npm run release -- minor
```

The script requires a clean `main`, runs the type check and build, bumps the version only if the current one is already on npm, publishes, then pushes the commit and tag.
