# 错误处理

状态码不在 `2xx` 范围内的响应会被视为错误。

```typescript
import { un } from "@uni-helper/uni-network";

un.get("/user/12345").catch((error) => {
  if (error.response) {
    // 请求已发出并收到响应，但状态码不在 2xx 范围内
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.task) {
    // 请求已经成功发起，但没有收到响应
    // `error.task` 是 task 实例
    console.log(error.task);
  } else {
    // 发送请求时出了点问题
    console.log("Error", error.message);
  }
  console.log(error.config);
});
```

使用 `validateStatus` 可以自定义哪些状态码会被视为错误。

```typescript
import { un } from "@uni-helper/uni-network";

un.get("/user/12345", {
  validateStatus: (status) => {
    return status < 500; // 处理状态码小于 500 的情况
  },
});
```

如果你追求语义化，可以使用导出的和挂载的状态码、[statuses-es](https://github.com/esm-ts/statuses-es)、[http-status-codes](https://github.com/prettymuchbryce/http-status-codes) 或 [node-http-status](https://github.com/adaltas/node-http-status)。

`HttpStatusCode` 里的 `WebServerReturnsAnUnknownError`（520）以及 413、422 的 RFC 9110 别名从 <Badge text="v1.0.0" type="info" /> 起提供。

```typescript
import { un, HttpStatusCode } from "@uni-helper/uni-network";

un.get("/user/12345", {
  validateStatus: (status) => {
    return status < HttpStatusCode.InternalServerError; // 处理状态码小于 500 的情况
    // return status < un.HttpStatusCode.InternalServerError; // 也可以使用挂载在 un 上的状态码
  },
});
```

使用 `toJSON` 可以获取更多关于 HTTP 错误的信息。

```typescript
un.get("/user/12345").catch((error) => {
  console.log(error.toJSON());
});
```

如果需要针对 `UnError` 和非 `UnError` 做处理，可以使用导出的 `isUnError` 方法判断。

```typescript
import { un, isUnError } from "@uni-helper/uni-network";

un.get("/user/12345").catch((error) => {
  if (isUnError(error)) {
    /* ... */
  } else {
    /* ... */
  }
});
```

## 错误码

`UnError` 的 `code` 字段标出错误来源，可以在 `catch` 里按它分支。

| `code` | 场景 |
| --- | --- |
| `ERR_NETWORK` | `uni.request` / `uni.uploadFile` / `uni.downloadFile` 的 `fail` 回调，且 `errMsg` 不是下面两种 |
| `ETIMEDOUT` | 请求超时，`errMsg` 为 `request:fail timeout` |
| `ERR_CANCELED` | 主动取消，`errMsg` 为 `request:fail abort` |
| `ERR_BAD_REQUEST` | 状态码 4xx，且 `validateStatus` 返回 `false` |
| `ERR_BAD_RESPONSE` | 其它状态码（5xx 等），且 `validateStatus` 返回 `false` |
| `ERR_INVALID_URL` | `url` 或 `baseUrl` 写成 `http:foo` 这种缺少 `//` 的形式 |
| `ERR_BAD_OPTION_VALUE` | `params` 里有循环引用，序列化前就会报错（新增于 <Badge text="v1.1.0" type="info" />） |

这些值也挂在 `UnError` 上，比如 `UnError.ERR_NETWORK`。`ERR_FR_TOO_MANY_REDIRECTS`、`ERR_BAD_OPTION`、`ERR_DEPRECATED`、`ERR_NOT_SUPPORT`、`ECONNABORTED`、`ECONNREFUSED` 是为对齐 `axios` 保留的常量，本库不会主动抛出，其中 `ECONNREFUSED` 从 <Badge text="v0.24.0" type="info" /> 起提供。

## 响应耗时与堆栈

- 成功响应和带响应的错误都有 `duration`（新增于 <Badge text="v1.1.0" type="info" />），单位毫秒，只统计适配器执行期间，不含拦截器和后处理。
- 从 <Badge text="v1.1.0" type="warning" /> 起，用 `UnError.from` 包装原始错误时，原始错误的堆栈会接在 `error.stack` 末尾并加 `Caused by: ` 前缀，原始错误本身在 `error.cause`，只读 `stack` 的上报工具也能看到根因。
- `error.cause` 从 <Badge text="v1.0.0" type="warning" /> 起是不可枚举属性，`JSON.stringify` 不会因为循环引用报错。
