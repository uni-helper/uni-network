# 拦截器

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

## 添加拦截器

可以全局添加请求或响应的拦截器。

```typescript
import { un } from "@uni-helper/uni-network";

// 添加请求拦截器
un.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
un.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
```

也可以给自定义实例添加请求或响应的拦截器。

```typescript
import { un } from "@uni-helper/uni-network";

// 创建实例
const instance = un.create();

// 添加请求拦截器
instance.interceptors.request.use(() => {
  /* ... */
});

// 添加响应拦截器
instance.interceptors.response.use(() => {
  /* ... */
});
```

## 移除拦截器

可以移除单个请求或响应的拦截器。

```typescript
import { un } from "@uni-helper/uni-network";

// 添加请求拦截器
const requestInterceptor = un.interceptors.request.use(() => {
  /* ... */
});
// 移除请求拦截器
un.interceptors.request.eject(requestInterceptor);

// 添加响应拦截器
const responseInterceptor = un.interceptors.response.use(() => {
  /* ... */
});
// 移除响应拦截器
un.interceptors.response.eject(responseInterceptor);
```

也可以移除所有请求或响应的拦截器。

```typescript
import { un } from "@uni-helper/uni-network";

// 创建实例
const instance = un.create();

// 添加请求拦截器
instance.interceptors.request.use(() => {
  /* ... */
});
// 移除所有请求拦截器
instance.interceptors.request.clear();

// 添加响应拦截器
instance.interceptors.response.use(() => {
  /* ... */
});
// 移除所有响应拦截器
instance.interceptors.response.clear();
```

## 拦截器选项

当你添加请求拦截器时，`@uni-helper/uni-network` 默认认为它们是异步的。当主线程被阻塞时，这可能会导致 `@uni-helper/uni-network` 请求的执行延迟（底层为拦截器创建了一个 `Promise`，你的请求被放在了调用栈的底部）。

如果你的请求拦截器是同步的，你可以在选项对象中添加一个标志，告诉 `@uni-helper/uni-network` 同步运行代码，避免请求执行中的任何延迟。

```typescript
import { un } from "@uni-helper/uni-network";

un.interceptors.request.use(
  (config) => {
    config.headers.test = "I am only a header!";
    return config;
  },
  null,
  { synchronous: true }
);
```

如果你想根据运行时检查来执行某个拦截器，你可以在 `options` 对象中设置 `runWhen` 函数。**当且仅当** `runWhen` 的返回值为 `false` 时，拦截器不会被执行。该函数将和 `config` 对象一起被调用（别忘了，你也可以绑定你自己的参数）。当你有一个只需要在特定时间运行的异步请求拦截器时，这可能会很方便。

```typescript
import { un } from "@uni-helper/uni-network";

const onGetCall = (config) => config.method.toUpperCase() === "GET";
un.interceptors.request.use(
  (config) => {
    config.headers.test = "special get headers";
    return config;
  },
  null,
  { runWhen: onGetCall }
);
```

## 多个拦截器

假设你添加了多个响应拦截器，并且响应是 `fulfilled` 状态时：

- 按照添加的顺序执行每个拦截器
- 只返回最后一个拦截器的结果
- 每个拦截器都会收到其前一个拦截器的结果
- 当 `fulfilled` 拦截器抛出时
  - 后面的 `fulfilled` 拦截器不会被调用
  - 后面的 `rejection` 拦截器会被调用
  - 一旦被捕获，后面的另一个 `fulfilled` 拦截器会被再次调用（就像在一个 `Promise` 链中一样）
