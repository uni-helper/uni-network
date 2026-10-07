# @uni-helper/uni-network (packages/core)

The published npm package. Root AGENTS.md commands and conventions apply; only deltas live here.

## Entry and build

- Entries are `src/index.ts` (default instance `un` plus all exports) and `src/composables.ts` (`useUn`). tsdown emits ESM/CJS/dts into `dist/`, and its `build:done` hook appends `module.exports = Object.assign(exports.default || {}, exports);` to `index.cjs` — without that line CJS consumers get a `{ default: … }` wrapper instead of the callable `un` instance.
- Adding a subpath export means touching three places: `package.json` `exports`, `typesVersions`, and the tsdown `entry` list.
- Per-package scripts: `pnpm -C packages/core run build` and `run dev` (watch). There is no per-package test script — tests run from the repo root via `pnpm test`.

## Gotchas

- `src/index.ts` imports `../package.json` for the version exposed as `un.VERSION`; there are no workspace-internal package imports, everything is relative paths.
- `src/types/config.ts` carries a large, platform-specific option surface (WeChat / Alipay quirks). When changing it, keep the「请求配置」comment block in `packages/core/README.md` and the docs site in sync.
