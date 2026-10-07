# uni-network

Promise-based HTTP client for uni-app (`@uni-helper/uni-network`), modeled on axios@0.27 but running on `uni.request` / `uni.uploadFile` / `uni.downloadFile`. pnpm monorepo: the only published package lives in `packages/core`, alongside a VitePress docs site and a uni-app playground.

## Project

- TypeScript ~6.0.3, ESM-first, build target ES2017. Dev machines pin Node via `.node-version` (26, mirrored in `devEngines.runtime`, warn-only); the published `engines` is `node>=18` — consumer-facing. Keep the two in sync when either changes.
- pnpm@12.9.1 via `packageManager` / `devEngines.packageManager` (enable corepack). Dependency versions are centralized in the `pnpm-workspace.yaml` `catalog:` — manifests reference `catalog:` instead of real ranges.
- Toolchain: tsdown (build, ESM+CJS+dts), Biome (lint + format), Vitest (test), lerna-lite (versioning + changelog).
- Workspace members: `packages/core` (published package), `docs` (VitePress site, deployed on Netlify), `playground` (H5 + WeChat mini-program).
- Package entry points: `.` and `./composables`, each in ESM/CJS/dts variants; `files: ["dist"]`.

## Commands

```bash
pnpm install             # install deps (corepack enable first)
pnpm build               # rimraf packages/*/dist, build all packages, then run build-post
pnpm dev                 # watch-build packages/*
pnpm test                # vitest run over the colocated *.test.ts files
pnpm test:coverage       # vitest run --coverage
pnpm typecheck           # tsc --noEmit
pnpm check               # biome check --write (the same command CI runs)
pnpm docs:dev            # VitePress dev server
pnpm play:dev:h5         # build packages, then playground in H5 mode
pnpm play:dev:mp-weixin  # build packages, then playground as WeChat mini-program
pnpm release             # lerna-lite version from Conventional Commits (main only)
```

## Architecture

All source lives in `packages/core/src`:

| Module | Role |
| --- | --- |
| `index.ts` | creates the default instance `un`, attaches `CancelToken` / `isCancel` / `UnError` / `HttpStatusCode` / `mergeConfig` / `VERSION` statics, re-exports everything |
| `core/Un.ts` | instance class: `request`, method aliases (`get` / `post` / …), `create()`, `getUri`; the `download` / `upload` aliases force `adapter: "download"` / `"upload"` |
| `core/dispatchRequest.ts` | resolves the adapter from config and dispatches |
| `core/settle.ts` | resolves or rejects via `validateStatus` |
| `core/UnInterceptorManager.ts` | request/response interceptors (`use` / `eject` / `clear`, `synchronous` + `runWhen` options) |
| `core/UnCancelToken.ts`, `core/UnCanceledError.ts` | CancelToken cancellation |
| `core/UnError.ts`, `core/isUnError.ts`, `core/isUnCancel.ts` | error type and guards |
| `adapters/request.ts`, `adapters/upload.ts`, `adapters/download.ts` | wrap `uni.request` / `uni.uploadFile` / `uni.downloadFile` into promised responses |
| `defaults/index.ts` | built-in defaults (`adapter: "request"`) |
| `utils/` | `buildUrl` / `buildFullPath`, per-adapter config builders (`buildRequestConfig` etc.), `extend` / `forEach` / `mergeConfig` |
| `types/` | `UnConfig` / `UnResponse` / `UnTask` and all public types |
| `composables.ts` | `useUn` (via vue-demi so vue2 and vue3 both work; consumes optional `@vueuse/core`) |

Tests are colocated (`*.test.ts` next to their sources) and run from the repo root; the vitest config only sets `clearMocks: true`.

## Conventions

- Biome 2.x owns lint + formatting (2-space indent); `.editorconfig` and `.vscode/settings.json` are committed — keep them accurate.
- Source comments and commit subjects are in Chinese; Conventional Commits (`feat` / `fix` / `docs` / …, scope `core` / `adapter` / `docs` / `playground`) drive the CHANGELOG and versions.
- All peer deps (`vue`, `@vueuse/core`, `@vue/composition-api`) are optional — the core must stay usable without Vue.
- User-visible changes must update both `docs/` (VitePress) and `packages/core/README.md`.
