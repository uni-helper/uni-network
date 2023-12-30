# 错误处理

`uni-network` 默认把每一个返回的状态代码不在 `2xx` 范围内的响应视为错误。

```ts
un.get('/user/12345').catch((error) => {
  if (error.response) {
    // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.task) {
    // 请求已经成功发起，但没有收到响应
    // `error.task` 是 task 实例
    console.log(error.task);
  } else {
    // 发送请求时出了点问题
    console.log('Error', error.message);
  }
  console.log(error.config);
});
```

使用 `validateStatus` 配置选项，可以自定义抛出错误的 HTTP code。

```ts
un.get('/user/12345', {
  validateStatus: (status) => {
    return status < 500; // 处理状态码小于 500 的情况
  },
});
```

如果你追求语义化，可以使用导出的和挂载的状态码、[statuses](https://github.com/jshttp/statuses)、[http-status-codes](https://github.com/prettymuchbryce/http-status-codes) 或 [node-http-status](https://github.com/adaltas/node-http-status)。

```ts
import { HttpStatusCode } from '@uni-helper/uni-network';

un.get('/user/12345', {
  validateStatus: (status) => {
    return status < HttpStatusCode.InternalServerError; // 处理状态码小于 500 的情况
    // return status < un.HttpStatusCode.InternalServerError; // 也可以使用挂载在 un 上的状态码
  },
});
```

使用 `toJSON` 可以获取更多关于 HTTP 错误的信息。

```ts
un.get('/user/12345').catch((error) => {
  console.log(error.toJSON());
});
```

如果需要针对 `UnError` 和非 `UnError` 做处理，可以使用导出的 `isUnError` 方法判断。

```ts
import { isUnError } from '@uni-helper/uni-network';

un.get('/user/12345').catch((error) => {
  if (isUnError(error)) {
    /* ... */
  } else {
    /* ... */
  }
});
```
