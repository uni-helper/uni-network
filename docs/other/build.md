# 构建与环境支持

目前 `@uni-helper/uni-network` 会使用 `tsdown` 将语法 Syntax 转译到 `ES2017`（即 `ES8`）。`uni` API 需要在项目构建时由 `uni-app` 官方提供的插件处理，其它 API 需要根据实际情况手动注入 Polyfill。

如果你希望提供更好的兼容性，请参考 [这里](https://vitesse-docs.netlify.app/getting-started/deployment#%E5%85%BC%E5%AE%B9%E6%80%A7)。
