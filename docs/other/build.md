# 构建与环境支持

目前 `@uni-helper/uni-network` 会使用 `unbuild` 将 `uni` API 之外的部分转译到 `ES2017`（即 `ES8`）。`uni` API 需要在项目构建时由 `uni-app` 官方提供的插件处理。

对于 `vue-cli + vue2` 项目，请修改项目根目录 `vue.config.js` 如下所示。这会让 `vue-cli` 处理 `@uni-helper/uni-network`，保证生成代码符合 `browserslist` 里的配置。我们建议设置 `browserslist` 为 `chrome>=53,ios>=8`。

```javascript
module.exports = {
  transpileDependencies: ['@uni-helper/uni-network'],
  // 如果是 vue-cli 5
  // transpileDependencies: true,
};
```

对于 `vite + vue3` 项目，请设置 `build.target` 为 `ES6`、`optimizeDeps.exclude` 包含 `vue-demi`。

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es6',
    cssTarget: 'chrome61', // https://cn.vitejs.dev/config/build-options.html#build-csstarget
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  plugins: [
    ...,
    uni(),
    ...,
  ],
});
```

然后在 `src/main.ts` 或 `src/main.js` 处自行添加 polyfill。以下是使用 [core-js](https://github.com/zloirock/core-js) 的示例（需要自行安装 `core-js`），你也可以使用 [es-shims](https://github.com/es-shims)。

```typescript
import 'core-js/actual/array/iterator';
import 'core-js/actual/promise';
import 'core-js/actual/object/assign';
import 'core-js/actual/promise/finally';
// 你可以根据需要自行添加额外的 polyfills
// import 'core-js/actual/object/values';
// import 'core-js/actual/url-search-params';
import { createSSRApp } from 'vue';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
```

微信小程序的 JavaScript 支持度见 [wechat-miniprogram/miniprogram-compat](https://github.com/wechat-miniprogram/miniprogram-compat)。微信小程序要支持 `vue3`，需设置基础库最低版本为 2.11.2 或以上，2.11.2 对应 `chrome>=53,ios>=10`。
