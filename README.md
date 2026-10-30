# @samijaber/builder-plugin

Personal Builder.io plugin that customizes the Builder UI.

## Features

- **Agent first**: when a Fusion project opens, the Agent tab is selected instead of Interact. Applies once per project per page load, so you can still switch tabs freely. Requires the Agent tab to be enabled for the project (feature flag or the project's Agent mode setting).

## Install

In Builder, go to Account Settings > Plugins and add:

```
@samijaber/builder-plugin
```

Builder resolves bare package names through jsDelivr, which serves `dist/plugin.system.js`. To pin a version, use `@samijaber/builder-plugin@0.1.0`, or paste a full URL. Non-`@builder.io` plugins need the `privatePlugins` feature on the org.

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
npm login
npm publish
```
