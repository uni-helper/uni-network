# @uni-helper/uni-network

[![License](https://img.shields.io/github/license/uni-helper/uni-network)](https://github.com/uni-helper/uni-network/blob/main/LICENSE)

[![npm](https://img.shields.io/npm/v/@uni-helper/uni-network)](https://www.npmjs.com/package/@uni-helper/uni-network)

为 `uni-app` 打造的基于 `Promise` 的 HTTP 客户端。要求 `node >= 14.18`。

## 起步

### 介绍

#### `@uni-helper/uni-network` 是什么？

`@uni-helper/uni-network` 是一个为 `uni-app` 打造的 [基于 Promise](https://javascript.info/promise-basics) 的 HTTP 客户端。灵感和代码绝大部分源于 `axios@0.27.2`。

#### 特性

- 默认请求使用 [uni.request](https://uniapp.dcloud.io/api/request/request.html)
- 上传文件使用 [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file.html#uploadfile)
- 下载文件使用 [uni.downloadFile](https://uniapp.dcloud.io/api/request/network-file.html#downloadfile)
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求

#### 设备和浏览器支持

需要设备和浏览器兼容 [ECMAScript 5](https://caniuse.com/#feat=es5) 并支持 [Promise](https://caniuse.com/promises)。你可以自行补充 polyfill。

#### 安装

使用 `npm`：

```shell
npm install @uni-helper/uni-network
```

使用 `yarn`：

```shell
yarn install @uni-helper/uni-network
```

`uni-app` 和 `pnpm` 结合使用存在问题，不建议使用 `pnpm` 安装依赖。

不考虑支持 `uni_modules`。

### 例子

#### 发起一个 `GET` 请求

```typescript
import un from '@uni-helper/uni-network';

un.get('user?ID=12345')
  .then((response) => {
    console.log('response', response);
  })
  .catch((error) => {
    console.log('error', error);
  })
  .finally(() => {});

// 上述请求和以下等同
un.get('/user', {
  params: {
    ID: 12345,
  },
})
  .then((response) => {
    console.log('response', response);
  })
  .catch((error) => {
    console.log('error', error);
  })
  .finally(() => {});

// 支持 async/await
async function getUser() {
  try {
    const response = await un.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

#### 发起一个 `POST` 请求

```typescript
un.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone',
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(() => {});
```

#### 并发请求

```typescript
function getUserAccount() {
  return un.get('/user/12345');
}

function getUserPermissions() {
  return un.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()]).then((responses) => {
  const acct = responses[0];
  const perm = responses[1];
});
```

## API

### 创建请求

可以向 `un` 传递相关配置来创建请求。

`un(config)`

```typescript
un({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

`un(url[, config])`

```typescript
un('/user/12345');
```

为了方便起见，已经为所有支持的请求方法提供了别名。在使用别名方法时，`url`、`method`、`data` 不需要在配置中指定。

- `un.request(config)`
- `un.download(config)`
- `un.upload(config)`
- `un.get(url[, config])`
- `un.delete(url[, config])`
- `un.head(url[, config])`
- `un.options(url[, config])`
- `un.trace(url[, config])`
- `un.connect(url[, config])`
- `un.post(url[, data[, config]])`
- `un.put(url[, data[, config]])`
- `un.patch(url[, data[, config]])`

### 实例

#### 创建实例

可以使用自定义配置创建一个实例。

`un.create([config])`

```typescript
const instance = un.create({
  baseUrl: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
```

#### 实例方法

以下是可用的实例方法。指定的配置将与实例的配置合并。

- `un.request(config)`
- `un.download(config)`
- `un.upload(config)`
- `un.get(url[, config])`
- `un.delete(url[, config])`
- `un.head(url[, config])`
- `un.options(url[, config])`
- `un.trace(url[, config]])`
- `un.connect(url[, config]])`
- `un.post(url[, data[, config]])`
- `un.put(url[, data[, config]])`
- `un.patch(url[, data[, config]])`
- `un.getUri([config])`

### 请求配置

这些是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method` 且没有指定 `adapter`，请求将默认使用 `GET` 方法。

```typescript
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `baseUrl` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
  // 设置一个 `baseUrl` 便于为 un 实例的方法传递相对 URL
  baseUrl: 'https://some-domain.com/api/',

  // 自定义请求头
  headers: {
    'content-type': 'application/json',
  },

  // `params` 是与请求一起发送的 URL 参数
  params: {
    ID: 12345
  },

  // `paramsSerializer` 是可选方法，主要用于序列化 `params`
  // 默认使用 [qs](https://github.com/ljharb/qs) 序列化
  paramsSerializer: (params) => { /* 返回一个字符串 */ }

  // `timeout` 指定请求超时的毫秒数
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  timeout: 1000, // 默认值是 `0` (永不超时)

  // `adapter` 允许自定义处理请求
  // 可以指定为 'request'、`upload` 和 `download` 三者之一
  // 也可以指定为一个方法，返回一个 Promise 并提供一个有效的响应
  adapter: 'request' // 默认值
  adapter: (config) => { /* ... */ },

  // `validateStatus` 定义了对于给定的 HTTP 状态码是 resolve 还是 reject
  // 如果 `validateStatus` 返回 `true`、`null` 或 `undefined`
  // 则 promise 将会被 resolve，否则会被 reject
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // 用于取消请求
  signal: new AbortController().signal,

  // 用于取消请求
  cancelToken: new CancelToken(function (cancel) {
  }),

  // 监听 HTTP Response Header 事件
  // 会比请求完成事件更早
  onHeadersReceived: (result) => { /* ... */ },

  // request 使用
  // 创建请求时使用的方法
  method: 'GET', // 默认值

  // request 使用
  // `data` 是作为请求体被发送的数据
  // 必须是以下类型之一：string、ArrayBuffer、Record<string, any>
  data: {
    firstName: 'Fred'
  },
  data: 'Country=Brasil&City=Belo Horizonte',

  // request 使用
  // 返回的数据类型
  // 如果设置为 json，会尝试对返回的数据做一次 JSON.parse
  dataType: 'json', // 默认值

  // request 使用
  // 响应的数据类型，选项包括 'text' 和 'arraybuffer'
  responseType: 'text', // 默认值

  // request 使用
  // 是否开启 http2
  enableHttp2: false, // 默认值

  // request 使用
  // 是否开启 quic
  enableQuic: false, // 默认值

  // request 使用
  // 是否开启缓存
  enableCache: false, // 默认值

  // request 使用
  // 是否开启 HttpDNS 服务
  enableHttpDNS: false, // 默认值

  // request 使用
  // HttpDNS 服务商 Id
  httpDNSServiceId: '',

  // request 使用
  // 是否开启 transfer-encoding chunked
  enableChunked: false, // 默认值

  // request 使用
  // 是否在 wifi 下使用移动网络发送请求
  forceCellularNetwork: false, // 默认值

  // request 使用
  // 是否验证 ssl 证书
  sslVerify: true, // 默认值

  // request 使用
  // 跨域请求时是否需要使用凭证
  withCredentials: false, // 默认值

  // request 使用
  // 是否在 DNS 解析时优先使用 ipv4
  firstIpv4: false, // 默认值

  // request 使用
  // 监听 Transfer-Encoding Chunk Received 事件
  // 当接收到新的 chunk 时触发
  onChunkReceived?: (response) => {/* ... */};

  // upload 使用
  // 需要上传的文件列表，files 和 filePath 必填一个
  // 使用该参数时，filePath 和 name 无效
  // 不支持小程序
  files: [],

  // upload 使用
  // 文件类型
  fileType: 'image', // image, video, audio

  // upload 使用
  // 文件对象
  file: new File(),

  // upload 使用
  // 文件路径，files 和 filePath 必填一个
  //
  // download 使用
  // 文件下载后存储的本地路径
  filePath: '/fake/path',

  // upload 使用
  // 文件名称
  name: 'fake-file.png',

  // upload 使用
  // 一个对象，会作为 HTTP 请求中其它额外的 form data
  formData?: Record<string, any>,

  // download 使用
  // 下载进度变化时触发
  // 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress > onProgressUpdate
  onDownloadProgress?: UnOnProgress;

  // download 使用
  // 下载进度变化时触发
  // 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress > onProgressUpdate
  onDownloadProgressUpdate?: UnOnProgress;

  // upload 使用
  // 上传进度变化时触发
  // 优先级 onUploadProgress > onUploadProgressUpdate > onProgress > onProgressUpdate
  onUploadProgress?: UnOnProgress;

  // upload 使用
  // 上传进度变化时触发
  // 优先级 onUploadProgress > onUploadProgressUpdate > onProgress > onProgressUpdate
  onUploadProgressUpdate?: UnOnProgress;

  // upload / download 使用
  // 上传/下载进度变化时触发
  // 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate / onDownloadProgressUpdate > onProgress > onProgressUpdate
  onProgress?: UnOnProgress;

  // upload / download 使用
  // 上传/下载进度变化时触发
  // 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate / onDownloadProgressUpdate > onProgress > onProgressUpdate
  onProgressUpdate?: UnOnProgress;
}
```

### 响应结构

一个请求的响应包含以下信息。

```typescript
{
  // `errMsg` 是可选的错误信息
  errMsg: '',

  // `errno` 是可选的错误代码
  errno: 0,

  // `profile` 是可选的调试信息
  profile: {},

  // `config` 是 `un` 请求的配置信息
  config: {},

  // `task` 是对应的 task 信息
  task: {}

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `data` 是由服务器提供的响应数据
  data: {},

  // request 特有
  // 服务器提供的 cookies 数据
  cookies: [],

  // download 特有
  // 临时本地文件路径
  // 没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件
  tempFilePath: '',

  // download 特有
  // 用户本地文件路径
  // 传入 filePath 时会返回，跟传入的 filePath 一致
  filePath: '',
}
```

当使用 then 时，你将接收如下响应：

```typescript
un.get('/user/12345').then((response) => {
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
});
```

当使用 `catch`，或者传递一个 `rejection callback` 作为 `then` 的第二个参数时，响应可以作为 `error` 对象被使用，正如在 [错误处理](#错误处理) 部分解释的那样。

### 默认配置

你可以指定默认配置，它将作用于每个请求。

#### 全局配置默认值

```typescript
un.defaults.baseUrl = 'https://api.example.com';
```

#### 自定义实例默认值

```typescript
// 创建实例时配置默认值
const instance = un.create({
  baseUrl: 'https://api.example.com',
});

// 创建实例后修改默认值
instance.defaults.baseUrl = 'https://api.another-example.com';
```

#### 配置的优先级

配置将会按优先级进行合并。优先级从低到高是内置的默认值、实例的 `defaults` 配置、请求的 `config`。后面的优先级要高于前面的。下面有一个例子。

```typescript
// 使用库提供的默认配置创建实例
// 此时超时配置的默认值是 `0`
const instance = un.create();

// 重写库的超时默认值
// 现在，所有使用此实例的请求都将等待 2.5 秒，然后才会超时
instance.defaults.timeout = 2500;

// 重写此请求的超时时间，因为该请求需要很长时间
instance.get('/longRequest', {
  timeout: 5000,
});
```

### 拦截器

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

#### 添加拦截器

```typescript
// 添加请求拦截器
un.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
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
  },
);
```

可以给自定义实例添加拦截器。

```typescript
const instance = un.create();
instance.interceptors.request.use(() => {
  /*...*/
});
```

#### 移除拦截器

```typescript
const myInterceptor = un.interceptors.request.use(() => {
  /*...*/
});
un.interceptors.request.eject(myInterceptor);
```

也可以移除所有请求或响应的拦截器。

```typescript
const instance = un.create();
instance.interceptors.request.use(() => {
  /*...*/
});
instance.interceptors.request.clear(); // 移除所有请求拦截器
instance.interceptors.response.use(() => {
  /*...*/
});
instance.interceptors.response.clear(); // 移除所有响应拦截器
```

#### 拦截器选项

当你添加请求拦截器时，`@uni-helper/uni-network` 默认认为它们是异步的。当主线程被阻塞时，这可能会导致 `@uni-helper/uni-network` 请求的执行延迟（底层为拦截器创建了一个 `Promise`，你的请求被放在了调用栈的底部）。如果你的请求拦截器是同步的，你可以在选项对象中添加一个标志，告诉 `@uni-helper/uni-network` 同步运行代码，避免请求执行中的任何延迟。

```typescript
un.interceptors.request.use(
  (config) => {
    config.headers.test = 'I am only a header!';
    return config;
  },
  null,
  { synchronous: true },
);
```

如果你想根据运行时检查来执行某个拦截器，你可以在 `options` 对象中设置 `runWhen` 函数。当且仅当 `runWhen` 的返回值为 `false` 时，拦截器不会被执行。该函数将和 `config` 对象一起被调用（别忘了，你也可以绑定你自己的参数）。当你有一个只需要在特定时间运行的异步请求拦截器时，这可能会很方便。

```typescript
const onGetCall = (config) => config.method.toUpperCase() === 'GET';
un.interceptors.request.use(
  (config) => {
    config.headers.test = 'special get headers';
    return config;
  },
  null,
  { runWhen: onGetCall },
);
```

#### 多个拦截器

假设你添加了多个响应拦截器，并且响应是 `fulfilled` 状态时：

- 执行每个拦截器
- 按照添加的顺序执行它们
- 只返回最后一个拦截器的结果
- 每个拦截器都会收到其前一个拦截器的结果
- 当 `fulfilled` 拦截器抛出时
  - 后面的 `fulfilled` 拦截器不会被调用
  - 后面的 `rejection` 拦截器会被调用
  - 一旦被捕获，后面的另一个 `fulfilled` 拦截器会被再次调用（就像在一个 `Promise` 链中一样）

### 错误处理

```typescript
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

```typescript
un.get('/user/12345', {
  validateStatus: (status) => {
    return status < 500; // 处理状态码小于 500 的情况
  },
});
```

如果你追求语义化，可以使用导出的和挂载的状态码、[statuses](https://github.com/jshttp/statuses)、[http-status-codes](https://github.com/prettymuchbryce/http-status-codes) 或 [node-http-status](https://github.com/adaltas/node-http-status)。

```typescript
import { HttpStatusCode } from '@uni-helper/uni-network';

un.get('/user/12345', {
  validateStatus: (status) => {
    return status < HttpStatusCode.InternalServerError; // 处理状态码小于 500 的情况
    // return status < un.HttpStatusCode.InternalServerError; // 也可以使用挂载在 un 上的状态码
  },
});
```

使用 `toJSON` 可以获取更多关于 HTTP 错误的信息。

```typescript
un.get('/user/12345').catch((error) => {
  console.log(error.toJSON());
});
```

如果需要针对 `UnError` 和非 `UnError` 做处理，可以使用导出的 `isUnError` 方法判断。

```typescript
import { isUnError } from '@uni-helper/uni-network';

un.get('/user/12345').catch((error) => {
  if (isUnError(error)) {
    /* ... */
  } else {
    /* ... */
  }
});
```

### 取消请求

支持使用 [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求。在 `uni-app` 环境，你可能需要使用 [polyfill](https://github.com/mysticatea/abort-controller)。

```typescript
const controller = new AbortController();

un.get('/foo/bar', {
  signal: controller.signal,
}).then(function (response) {
  //...
});
// 取消请求
controller.abort();
```

你也可以使用 `CancelToken`。

```typescript
const CancelToken = un.CancelToken;
const source = CancelToken.source();

un.get('/user/12345', {
  cancelToken: source.token,
}).catch(function (thrown) {
  if (un.isUnCancel(thrown)) {
    console.log('Request canceled', thrown.message);
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

```js
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

> 注意：你可以用同一个 `CancelToken` / `AbortController` 取消几个请求。
> 如果在发起请求的时候已经取消请求，那么该请求就会被立即取消，不会真正发起请求。

## 其它

### 构建

目前 `@uni-helper/uni-network` 会使用 `tsup` 将 `uni` API 之外的部分转译到 `esnext`。`uni` API 需要在项目构建时由 `uni-app` 官方提供的插件处理。

对于 `vue-cli`，请修改项目根目录 `vue.config.js` 如下所示。

```js
module.exports = {
  transpileDependencies: ['@uni-helper/uni-network'],
};
```

对于 `vite`，你无需手动额外调整。

### 高级功能

对于缓存、去重的高级功能，建议结合 [@tanstack/query](https://tanstack.com/query/)、[swrv](https://docs-swrv.netlify.app/)、[vue-request](https://www.attojs.com/) 等库使用。

### 为什么不是 `axios`？

`axios` 非常棒，但它面对的是浏览器和 `Node.js`，即使使用了 `adapter`，某些底层功能也可能会在小程序内报错，而且需要修改 `axios` 大部分类型定义。

### 比较

如果你发现这里信息已经过时，请提交 ISSUE 或 PR。

|                    | `axios`                                                                                                                                                              | `luch-request`                                                                                                                                                                                   | `uni-ajax`                                                                                                                                                                       | `@uni-helper/uni-network`                                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基本信息           | [![npm](https://img.shields.io/npm/v/axios)](https://www.npmjs.com/package/axios) [![npm](https://img.shields.io/npm/dw/axios)](https://www.npmjs.com/package/axios) | [![npm](https://img.shields.io/npm/v/luch-request)](https://www.npmjs.com/package/luch-request) [![npm](https://img.shields.io/npm/dw/luch-request)](https://www.npmjs.com/package/luch-request) | [![npm](https://img.shields.io/npm/v/uni-ajax)](https://www.npmjs.com/package/uni-ajax) [![npm](https://img.shields.io/npm/dw/uni-ajax)](https://www.npmjs.com/package/uni-ajax) | [![npm](https://img.shields.io/npm/v/@uni-helper/uni-network)](https://www.npmjs.com/package/@uni-helper/uni-network) [![npm](https://img.shields.io/npm/dw/@uni-helper/uni-network)](https://www.npmjs.com/package/@uni-helper/uni-network) |
| 开发语言           | JavaScript                                                                                                                                                           | JavaScript                                                                                                                                                                                       | JavaScript                                                                                                                                                                       | TypeScript                                                                                                                                                                                                                                   |
| 类型支持           | `index.d.ts`（没有考虑 `uni-app`）                                                                                                                                   | `index.d.ts`（泛型支持较差）                                                                                                                                                                     | `index.d.ts`                                                                                                                                                                     | 包含                                                                                                                                                                                                                                         |
| 运行环境           | 浏览器和 `Node.js`                                                                                                                                                   | `uni-app`                                                                                                                                                                                        | `uni-app`                                                                                                                                                                        | `uni-app`                                                                                                                                                                                                                                    |
| `Promise`          | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| `uni_modules`      | ×                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | ×                                                                                                                                                                                                                                            |
| `npm`              | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 实例化             | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 请求说明           | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 响应说明           | √                                                                                                                                                                    | ×                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 任务说明           | ×（没有考虑 `uni-app`  任务）                                                                                                                                        | ×                                                                                                                                                                                                | √（只有 `requestTask`  说明）                                                                                                                                                    | √（只有简单说明）                                                                                                                                                                                                                            |
| 适配器             | √（内置 `xhr` 和 `http`）                                                                                                                                            | ×                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| `uni.request`      | ×（自行开发，还需要覆写类型）                                                                                                                                        | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| `uni.downloadFile` | ×（自行开发，还需要覆写类型）                                                                                                                                        | √                                                                                                                                                                                                | ×（自行开发，还需要覆写类型）                                                                                                                                                    | √                                                                                                                                                                                                                                            |
| `uni.uploadFile`   | ×（自行开发，还需要覆写类型）                                                                                                                                        | √                                                                                                                                                                                                | ×（自行开发，还需要覆写类型）                                                                                                                                                    | √                                                                                                                                                                                                                                            |
| 请求拦截器         | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 响应拦截器         | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 配置说明           | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 取消请求说明       | √                                                                                                                                                                    | ×                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 错误处理说明       | √                                                                                                                                                                    | ×                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |
| 测试               | 完善                                                                                                                                                                 | 部分                                                                                                                                                                                             | 无                                                                                                                                                                               | 部分                                                                                                                                                                                                                                         |
| 使用示例           | √                                                                                                                                                                    | √                                                                                                                                                                                                | √                                                                                                                                                                                | √                                                                                                                                                                                                                                            |

## 资源

- [改动日志](https://github.com/uni-helper/uni-network/tree/main/CHANGELOG.md)

## 致谢

- [axios](https://axios-http.com/)
- [luch-request](https://github.com/lei-mu/luch-request)
- [uni-ajax](https://uniajax.ponjs.com/)
- [vue-use](https://vueuse.org/)
- [react-query](https://tanstack.com/query/)
- [swr](https://swr.vercel.app/)
- [vue-query](https://github.com/DamianOsipiuk/vue-query)
- [@tanstack/query](https://tanstack.com/query/v4)
- [swrv](https://docs-swrv.netlify.app/)
- [vue-request](https://www.attojs.com/)
