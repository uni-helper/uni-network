<a href="https://uni-network.netlify.app"><img src="https://cdn.jsdelivr.net/gh/uni-helper/uni-network@main/banner.svg" alt="banner" width="100%"/></a>

# @uni-helper/uni-network

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/uni-helper/uni-network@main/logo.svg" alt="logo" width="256" height="256" />
</p>

<p align="center">
  <a href="https://github.com/uni-helper/uni-network/blob/main/LICENSE"><img src="https://img.shields.io/github/license/uni-helper/uni-network?style=for-the-badge&labelColor=005947&color=eee" alt="License"></a>
  <a href="https://github.com/uni-helper/uni-network/stargazers"><img src="https://img.shields.io/github/stars/uni-helper/uni-network?style=for-the-badge&labelColor=005947&color=eee" alt="GitHub Stars"></a>
  <a href="https://npmx.dev/package/@uni-helper/uni-network"><img src="https://img.shields.io/npm/v/@uni-helper/uni-network?style=for-the-badge&labelColor=005947&color=eee" alt="NPM version"></a>
  <a href="https://npmx.dev/package/@uni-helper/uni-network"><img src="https://img.shields.io/npm/dm/@uni-helper/uni-network?style=for-the-badge&labelColor=005947&color=eee" alt="npm downloads"></a>
  <a href="https://app.netlify.com/sites/uni-network/deploys"><img src="https://api.netlify.com/api/v1/badges/a00f6b6f-9d1d-4788-aa78-a7db02bac5f0/deploy-status" alt="Netlify"></a>
</p>
<p align="center">
  <a href="https://github.com/ModyQyW"><img src="https://img.shields.io/badge/Author%20%26%20Maintainer-ModyQyW-blue?style=for-the-badge" alt="Author & Maintainer"></a>
</p>

为 `uni-app` 打造的基于 `Promise` 的 HTTP 客户端。要求 `node>=18`。

不想看文档？直接问 AI 🤖 <a href="https://deepwiki.com/uni-helper/uni-network"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>

> **请考虑持续[赞助](https://github.com/ModyQyW/sponsors)以维持该项目的持续健康发展，非常感谢！🙏**

## 安装

```shell
npm install @uni-helper/uni-network
```

也可以使用 `yarn add @uni-helper/uni-network` 或 `pnpm add @uni-helper/uni-network`，各包管理器的注意事项见[在线文档](https://uni-network.netlify.app)。

## 使用

```typescript
import { un } from "@uni-helper/uni-network";

un.get("/user?ID=12345").then((response) => {
  console.log(response);
});
```

完整的安装说明、API 参考、拦截器、取消请求、TypeScript 支持和组合式函数文档，请阅读[在线文档](https://uni-network.netlify.app)或 [packages/core/README.md](./packages/core/README.md)。

## 感谢

灵感与大部分代码源于 [axios](https://axios-http.com/)，完整致谢列表见[包 README](./packages/core/README.md#致谢)。

## 关联项目

- [@uni-helper/axios-adapter](https://github.com/uni-helper/axios-adapter) — 坚持 `axios` 时的 `adapter` 方案

## 包

| 包名 | 说明 |
| --- | --- |
| [@uni-helper/uni-network](https://npmx.dev/package/@uni-helper/uni-network) | 为 `uni-app` 打造的基于 `Promise` 的 HTTP 客户端 |

## 参与贡献

欢迎提交 PR！请先阅读[贡献指南](./CONTRIBUTING.md)。

## 许可证

[MIT](./LICENSE)
