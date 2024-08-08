# 取消请求

## AbortController

支持使用 [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求。要使用 AbortController，请使用 Polyfill。

### abortcontroller-polyfill

::: code-group

```sh [npm]
npm install abortcontroller-polyfill@^1.7.5
```

```sh [yarn]
yarn add abortcontroller-polyfill@^1.7.5
```

````sh [pnpm]
pnpm add abortcontroller-polyfill@^1.7.5

:::

在 `App.vue` 中仅可能早地导入，后续可全局使用。

```vue
<script setup>
// 尽可能早地导入，后续可全局使用
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
</script>
```

### abort-controller

::: code-group

```sh [npm]
npm install abort-controller@^3.0.0
````

```sh [yarn]
yarn add abort-controller@^3.0.0
```

```sh [pnpm]
pnpm add abort-controller@^3.0.0
```

:::

必须导入后使用，不可全局使用。

```typescript
import { un } from '@uni-helper/uni-network';
// 必须导入后使用
import AbortController from 'abort-controller/dist/abort-controller';
// ❌ 错误做法 1
// import AbortController from 'abort-controller';
// ❌ 错误做法 2
// import 'abort-controller/polyfill';

const controller = new AbortController();

un.get('/foo/bar', {
  signal: controller.signal,
}).then(function (response) {
  //...
});
// 取消请求
controller.abort();
```

## CancelToken

你也可以使用 `CancelToken` 来取消请求。

```typescript
import { un } from '@uni-helper/uni-network';

const CancelToken = un.CancelToken;
const source = CancelToken.source();

un.get('/user/12345', {
  cancelToken: source.token,
}).catch(function (error) {
  if (un.isUnCancel(error)) {
    console.log('Request canceled', error.message);
  } else {
    // 处理错误
  }
});

un.post(
  '/user/12345',
  {
    name: 'new name',
  },
  {
    cancelToken: source.token,
  },
);
// 取消请求（信息是可选的）
source.cancel('Operation canceled by the user.');
```

你也可以通过向 `CancelToken` 构造函数传递一个执行函数来创建一个 `CancelToken` 实例。

```typescript
import { un } from '@uni-helper/uni-network';

const CancelToken = un.CancelToken;
let cancel;

un.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  }),
});

// 取消请求
cancel();
```

::: tip 取消请求的数量

你可以用同一个 `CancelToken` / `AbortController` 取消几个请求。

:::

::: tip 发起请求时取消请求

如果在发起请求的时候已经取消请求，那么该请求就会被立即取消，不会真正发起请求。

:::
