# 贡献指南

首先，感谢你有兴趣为 `@uni-helper/uni-network` 贡献代码。

在开始之前，请先浏览 [已开放的 issue](https://github.com/uni-helper/uni-network/issues)。如果是新特性或较大改动，建议先开 issue 讨论方案，避免重复劳动或方向偏差。

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| Node.js | `>=18`，推荐 LTS；仓库 `.node-version` 为 `24` |
| 包管理器 | `pnpm@10.34.4`（通过 Corepack 启用，不要混用 npm/yarn） |
| Git | 配置 `core.autocrlf false`、`core.eol lf`，行尾统一为 LF |

仓库使用 pnpm workspace，所有命令都基于 pnpm。

## 拉取代码并安装依赖

```shell
git clone https://github.com/uni-helper/uni-network.git
cd uni-network
corepack enable
pnpm install
```

## 目录结构

```text
.
├── packages/
│   └── core/          # 发布到 npm 的包 @uni-helper/uni-network
│       └── src/
│           ├── adapters/    # 请求适配器
│           ├── core/        # 核心实现
│           ├── defaults/    # 默认配置
│           ├── types/       # 类型定义
│           ├── utils/       # 工具函数
│           ├── composables.ts
│           └── index.ts
├── docs/              # VitePress 文档站点
├── playground/        # 本地调试用的示例工程（H5 / 微信小程序）
└── package.json
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 以 watch 模式构建 `packages/*`，便于联调 |
| `pnpm build` | 构建全部子包 |
| `pnpm test` | 运行单元测试（Vitest） |
| `pnpm test:coverage` | 运行测试并输出覆盖率 |
| `pnpm typecheck` | TypeScript 类型检查（`tsc --noEmit`） |
| `pnpm check` | 用 Biome 检查并自动修复格式与 lint 问题 |
| `pnpm docs:dev` | 本地启动文档站点 |
| `pnpm docs:build` | 构建文档站点 |
| `pnpm play:dev:h5` | 构建 `packages/*` 后，以 H5 模式启动 playground |
| `pnpm play:dev:mp-weixin` | 构建 `packages/*` 后，以微信小程序模式启动 playground |

提交前请确保 `pnpm build`、`pnpm test`、`pnpm typecheck` 均通过，CI（见下文）会在这三项上跑 ubuntu/macos/windows × Node 20/22/24 的矩阵。

## 代码风格

- 格式化与 lint 由 [Biome](./biome.json) 统一管理，缩进 2 空格、行尾 LF（见 `.editorconfig`）。
- 新增代码请补类型；对外 API 使用 JSDoc 说明用途、参数与边界情况。
- 修复 bug 或新增能力时，优先补对应的单元测试（与 `src` 同级、`*.test.ts` 命名）。

## 提交规范

仓库基于 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 生成 CHANGELOG 与版本发布，提交信息必须遵循：

```text
<type>(<scope>): <subject>
```

常用 `type`：

- `feat`：新功能
- `fix`：bug 修复
- `docs`：文档变更
- `refactor`：既非新增功能也非修复的代码改动
- `perf`：性能优化
- `test`：新增或修正测试
- `build`：构建系统或依赖变更
- `ci`：CI 配置变更
- `chore`：杂项（不体现在 CHANGELOG 中）

`scope` 可选，例如 `core`、`adapter`、`docs`、`playground`。`subject` 用祈使句、现在时，结尾不加句号。

示例：

```text
feat(core): 支持自定义请求适配器
fix(adapter): 修复微信小程序下 headers 合并顺序
docs: 补充拦截器使用示例
```

破坏性变更在 `type`/`scope` 后加 `!`，并在 footer 写明 `BREAKING CHANGE:`。

## 提交 Pull Request

1. 基于 `main` 创建特性分支：`feat/xxx`、`fix/xxx`、`docs/xxx`。
2. 保持改动聚焦，一个 PR 只解决一件事；较大的改动先在 issue 中达成共识。
3. 确保本地 `pnpm check`、`pnpm test`、`pnpm typecheck`、`pnpm build` 均通过。
4. 如改动用户可见行为，更新 `docs/` 下相关文档。
5. PR 描述写清「改了什么 / 为什么改 / 如何验证」，关联相关 issue（如 `Closes #123`）。
6. 等待 CI 通过与维护者 review，按反馈在原分支上继续提交。

## 发布说明（面向维护者）

发布由 [Lerna](./lerna.json) 与 GitHub Actions（`.github/workflows/release.yml`）驱动，贡献者一般无需关心：

- 版本号通过 `pnpm release`（Lerna）按 Conventional Commits 自动推断，仅在 `main` 分支允许。
- 打 tag 触发 `release.yml`：用 `changelogithub` 生成 GitHub Release，`pnpm -r publish` 发布到 npm。
