# uni-network

为 uni-app 打造的基于 Promise 的 HTTP 客户端（`@uni-helper/uni-network`）。API 形态沿用 axios@0.27，实际发请求走 `uni.request` / `uni.uploadFile` / `uni.downloadFile`。上游 axios 1.x 的修复只要适用就移植过来，CHANGELOG 里带 `sync` 的条目对应的就是这些修复。pnpm monorepo，唯一发布的包在 `packages/core`，同仓库还有 VitePress 文档站和 uni-app playground。

## 项目概况

- TypeScript ~6.0.3，ESM 优先，构建目标 ES2017。开发机用 `.node-version` 固定 Node 26，同一个版本写在 `devEngines.runtime`，不匹配只警告；发布包的 `engines` 是 `node>=18`，面向使用者。改其中一个时把另一个一起改。
- pnpm@12.16.1 由 `packageManager` / `devEngines.packageManager` 固定，先跑 `corepack enable`。依赖版本集中在 `pnpm-workspace.yaml` 的 `catalog:`，各 package.json 引用 `catalog:`，不写具体范围。
- 工具链：tsdown 负责构建（ESM + CJS + dts），Biome 管 lint 和格式化，Vitest 跑测试，lerna-lite 管版本和 CHANGELOG。
- 工作区成员：`packages/core` 是发布的包；`docs` 是 VitePress 站点，部署在 Netlify 和 Cloudflare Pages，另有 https://uni-helper.js.org/uni-network；`playground` 是 H5 和微信小程序的调试工程。
- 包入口：`.` 和 `./composables`，各带 ESM / CJS / dts 三套产物，发布内容为 `files: ["dist"]`。

## 常用命令

```bash
pnpm install               # 安装依赖（先 corepack enable）
pnpm build                 # 清掉 packages/*/dist，构建所有包，再跑 build-post
pnpm dev                   # 以 watch 模式构建 packages/*
pnpm test                  # vitest run，跑就近放置的 *.test.ts
pnpm test:coverage         # vitest run --coverage
pnpm typecheck             # tsc --noEmit
pnpm check                 # biome check --write，CI 跑的是同一条命令
pnpm docs:dev              # VitePress 开发服务器
pnpm docs:build            # 构建文档站，Netlify / Cloudflare Pages 跑的就是它
pnpm docs:preview          # 预览构建好的文档站
pnpm play:dev:h5           # 先构建 packages，再以 H5 模式启动 playground
pnpm play:dev:mp-weixin    # 先构建 packages，再以微信小程序模式启动 playground
pnpm play:build:h5         # CI 任务：playground 的 H5 生产构建
pnpm play:build:mp-weixin  # CI 任务：playground 的微信小程序生产构建
pnpm release               # lerna-lite 按 Conventional Commits 定版本，只在 main 上跑
```

## 架构

源码全在 `packages/core/src`：

| 模块                                                                | 职责                                                                                                                                                                  |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`                                                          | 创建默认实例 `un`，挂上 `CancelToken` / `isCancel` / `UnError` / `isUnError` / `HttpStatusCode` / `mergeConfig` / `all` / `VERSION` 等静态属性，并重新导出所有内容    |
| `core/Un.ts`                                                        | 实例类：`request`、各方法别名（`get` / `post` / …）、`create()`、`getUri`；`download` / `upload` 别名强制 `adapter: "download"` / `"upload"`                          |
| `core/dispatchRequest.ts`                                           | 按 config 选适配器并派发，成功响应和带响应的失败都写上 `duration`                                                                                                     |
| `core/settle.ts`                                                    | 按 `validateStatus` 决定 resolve 还是 reject                                                                                                                          |
| `core/UnInterceptorManager.ts`                                      | 请求 / 响应拦截器（`use` / `eject` / `clear`，`synchronous` 与 `runWhen` 选项）；id 自增不复用                                                                        |
| `core/UnCancelToken.ts`、`core/UnCanceledError.ts`                  | CancelToken 取消                                                                                                                                                      |
| `core/UnError.ts`、`core/isUnError.ts`、`core/isUnCancel.ts`        | 错误类型与类型守卫；`UnError.from` 会把被包装错误的堆栈接在 `Caused by: ` 后面，拼装逻辑在 `core/causeStack.ts`（内部模块，不从入口导出）                             |
| `adapters/request.ts`、`adapters/upload.ts`、`adapters/download.ts` | 把 `uni.request` / `uni.uploadFile` / `uni.downloadFile` 包成 Promise 响应                                                                                            |
| `defaults/index.ts`                                                 | 内置默认配置（`adapter: "request"`）                                                                                                                                  |
| `utils/`                                                            | `buildUrl` / `buildFullPath`、各适配器的配置构造器（`buildRequestConfig` 等）、`extend` / `forEach` / `mergeConfig`；`assertParamsAcyclic` 只在库内使用，不从入口导出 |
| `types/`                                                            | `UnConfig` / `UnResponse` / `UnTask` 等全部公开类型                                                                                                                   |
| `composables.ts`                                                    | `useUn`，用 vue-demi 同时支持 vue2 和 vue3，`@vueuse/core` 是可选依赖                                                                                                 |

测试和源码放在一起（`*.test.ts` 紧挨着对应源码），在仓库根目录跑；vitest 配置只设了 `clearMocks: true`。

## 文档

`docs/`（VitePress）和 `packages/core/README.md` 讲的是同一批内容，改动行为基本要同时改两处。`docs/.vitepress/config.ts` 的侧边栏是手写的，新增页面不加进去就不会出现在站点里。

每个页面都有一个对应的源码出处：

| 文档页                                             | 对应源码                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| `docs/api/request-config.md`                       | `types/config.ts` 和三个 `utils/build*Config.ts` 构造器                    |
| `docs/api/response-schema.md`                      | `types/response.ts`，以及各适配器拼出来的 `response` 对象                  |
| `docs/api/config-defaults.md`                      | `defaults/index.ts` 和 `index.ts` 里的 `createInstance`                    |
| `docs/api/introduction.md`、`docs/api/instance.md` | `core/Un.ts` 的方法和 `index.ts` 挂上去的静态属性                          |
| `docs/advanced/handling-errors.md`                 | `core/UnError.ts`、`core/settle.ts`，以及各适配器的 `fail` 分支            |
| `docs/advanced/cancellation.md`                    | `core/UnCancelToken.ts`、`core/dispatchRequest.ts`，以及各适配器的取消处理 |
| `docs/advanced/composition-api.md`                 | `composables.ts`                                                           |
| `docs/other/build.md`                              | `packages/core/tsdown.config.ts`                                           |

## 约定

- lint 和格式化归 Biome 2.x（2 空格缩进）；`.editorconfig` 和 `.vscode/settings.json` 已提交，改配置时一起改。
- 源码注释和提交标题用中文；提交遵循 Conventional Commits（`feat` / `fix` / `docs` / …，scope 用 `core` / `adapter` / `docs` / `playground`），CHANGELOG 和版本号由它生成。
- 所有 peer 依赖（`vue`、`@vueuse/core`、`@vue/composition-api`）都是可选的，不装 Vue 也要能用。
- 用户可见的改动要同时更新 `docs/` 和 `packages/core/README.md`。
- 三个适配器遵循同一套流程：用 `utils/build<Request|Upload|Download>Config` 把配置转成 uni 参数，经 `core/settle.ts` 决定 resolve 还是 reject，在返回的 task 上挂 `onHeadersReceived` 和进度回调，每条退出路径都调 `done()` 退订 `cancelToken` / `signal` 监听。
- `types/config.ts` 对应 uni-app 的 `RequestOptions` / `UploadFileOption` / `DownloadFileOption`，而构造器只转发自己列出的键。新增一个 uni 配置项要同时改类型、改对应的 `utils/build*Config.ts`、改 `docs/api/request-config.md`。
