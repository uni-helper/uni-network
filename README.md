# @uni-helper/uni-network

[![License](https://img.shields.io/github/license/uni-helper/uni-network)](https://github.com/uni-helper/uni-network/blob/main/LICENSE)

[![npm](https://img.shields.io/npm/v/@uni-helper/uni-network)](https://www.npmjs.com/package/@uni-helper/uni-network)

[![Netlify Status](https://api.netlify.com/api/v1/badges/a00f6b6f-9d1d-4788-aa78-a7db02bac5f0/deploy-status)](https://app.netlify.com/sites/uni-network/deploys)

[Vitepress 在线文档](https://uni-network.netlify.app)

为 `uni-app` 打造的基于 `Promise` 的 HTTP 客户端。要求 `node>=18`。

- [@uni-helper/uni-network](#uni-helperuni-network)
  - [指南](#指南)
    - [介绍](#介绍)
    - [起步](#起步)
    - [基本用例](#基本用例)
      - [GET 请求](#get-请求)
      - [使用 async/await 的 GET 请求](#使用-asyncawait-的-get-请求)
      - [POST 请求](#post-请求)
      - [并发请求](#并发请求)
  - [API](#api)
    - [API](#api-1)
      - [`un(config)`](#unconfig)
      - [`un(url[, config])`](#unurl-config)
      - [请求别名](#请求别名)
    - [实例](#实例)
      - [`un.create([config])`](#uncreateconfig)
      - [实例方法](#实例方法)
    - [请求配置](#请求配置)
    - [响应结构](#响应结构)
    - [默认配置](#默认配置)
      - [全局配置默认值](#全局配置默认值)
      - [自定义实例默认值](#自定义实例默认值)
      - [配置的优先级](#配置的优先级)
  - [进阶](#进阶)
    - [拦截器](#拦截器)
      - [添加拦截器](#添加拦截器)
      - [移除拦截器](#移除拦截器)
      - [拦截器选项](#拦截器选项)
      - [多个拦截器](#多个拦截器)
    - [错误处理](#错误处理)
    - [取消请求](#取消请求)
      - [AbortController](#abortcontroller)
      - [CancelToken](#canceltoken)
    - [TypeScript 支持](#typescript-支持)
    - [高级功能](#高级功能)
      - [缓存](#缓存)
      - [去重](#去重)
      - [重试](#重试)
      - [响应失败不抛出错误](#响应失败不抛出错误)
      - [无感刷新登录态](#无感刷新登录态)
      - [全局请求加载](#全局请求加载)
    - [组合式函数](#组合式函数)
  - [其它](#其它)
    - [构建与环境支持](#构建与环境支持)
    - [比较](#比较)
  - [资源](#资源)
  - [致谢](#致谢)

## 指南

### 介绍

`@uni-helper/uni-network` 是一个为 [uni-app](https://uniapp.dcloud.io/) 打造的 [基于 Promise](https://javascript.info/promise-basics) 的 HTTP 客户端。

`@uni-helper/uni-network` 灵感和代码绝大部分源于 `axios@0.27.2`，功能包括：

- 默认请求使用 [uni.request](https://uniapp.dcloud.io/api/request/request.html)
- 上传文件使用 [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file.html#uploadfile)
- 下载文件使用 [uni.downloadFile](https://uniapp.dcloud.io/api/request/network-file.html#downloadfile)
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- [拦截](#拦截器)请求和响应
- [取消请求](#取消请求)
- [TypeScript 支持](#typescript-支持)
- [组合式函数](#组合式函数)

### 起步

`@uni-helper/uni-network` 要求你使用 `node>=18`。建议你使用 Node.js 的 LTS 版本。

- npm

  ```shell
  npm install @uni-helper/uni-network
  ```

- yarn

  ```shell
  yarn add @uni-helper/uni-network
  ```

  > 如果你正在使用 yarn v1+，请参考 [文档](https://yarnpkg.com/configuration/yarnrc/#nodeLinker) 设置 `nodeLinker` 为 `node_modules`。

- pnpm

  ```shell
  pnpm add @uni-helper/uni-network
  ```

  > 如果你正在使用 pnpm，请参考 [文档](https://pnpm.io/npmrc#shamefully-hoist) 设置 `shamefully-hoist` 为 `true`。

> 目前不支持 `uni_modules`，也没有人力、精力和时间支持 `uni_modules`，但欢迎 PR 贡献！🫡

### 基本用例

#### GET 请求

```typescript
import { un } from '@uni-helper/uni-network';

// 请求特定 ID 的用户数据
un.get('/user?ID=12345')
  .then((response) => {
    // 处理响应
    console.log('response', response);
  })
  .catch((error) => {
    // 处理错误
    console.log('error', error);
  })
  .finally(() => {
    // 总是会执行
  });

// 上述请求和以下等同
un.get('/user', {
  params: {
    ID: '12345',
  },
})
  .then((response) => {
    console.log('response', response);
  })
  .catch((error) => {
    console.log('error', error);
  })
  .finally(() => {
    // 总是会执行
  });
```

> `un` 是 `uni` 和 `network` 的首字母缩写。如果你不习惯这个名称，你可以在导入时自行调整，比如使用 `uniNetwork`：`import { un as uniNetwork } from '@uni-helper/uni-network';`。

#### 使用 async/await 的 GET 请求

```typescript
import { un } from '@uni-helper/uni-network';

async function getUser() {
  try {
    const response = await un.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

#### POST 请求

```typescript
import { un } from '@uni-helper/uni-network';

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
import { un } from '@uni-helper/uni-network';

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

基本用例应该能让你初步上手 `@uni-helper/uni-network`。你可以动手尝试一下，也可以继续往下阅读。

## API

### API

可以直接向导入的 `un` 传递相关配置来发起请求。

#### `un(config)`

```typescript
import { un } from '@uni-helper/uni-network';

// 发起 POST 请求
un({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

#### `un(url[, config])`

```typescript
import { un } from '@uni-helper/uni-network';

// 发起 GET 请求（默认请求方法）
un('/user/12345');
```

#### 请求别名

为了方便起见，已经为所有支持的请求方法提供了别名。在使用别名方法时，`url`、`method`、`data` 不需要在 `config` 中指定。如果同时指定，`config` 中指定的字段会被覆盖掉。

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

可以使用自定义配置创建一个实例。

#### `un.create([config])`

```typescript
import { un } from '@uni-helper/uni-network';

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

以下是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method` 且没有指定 `adapter`，请求将默认使用 `GET` 方法。

```typescript
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `baseUrl` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
  // 设置一个 `baseUrl` 便于为实例方法传递相对 URL
  baseUrl: 'https://some-domain.com/api/',

  // 自定义请求头
  // 不能设置 Referer
  headers: {
    'content-type': 'application/json',
  },

  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个普通对象或一个 URLSearchParams 对象
  // 要使用 URLSearchParams 对象，请使用 core-js 提供的 polyfill
  // 可参考构建与环境支持部分的说明或该仓库提供的 playground
  params: {
    ID: 12345
  },

  // `paramsSerializer` 是可选方法，主要用于序列化 `params`
  // 默认使用 [fast-querystring](https://github.com/anonrig/fast-querystring) 序列化
  // [qs](https://github.com/ljharb/qs) v6.10.0 开始引入了 `get-intrinsic`，结合微信小程序和微信小程序插件使用时会出现报错，如有需要可以使用 v6.9.7
  // [query-string](https://github.com/sindresorhus/query-string) v8.1.0 使用了支付宝小程序不支持的语法，如无支付宝小程序需求也可以使用 query-string，它体积比 qs 小，性能比 qs 好
  paramsSerializer: (params) => { /* 返回一个字符串 */ }

  // `timeout` 指定请求超时的毫秒数
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  // 要设置永不超时，可以将其设置为 Number.POSITIVE_INFINITY
  // 默认值是实际调用的 API 的默认值，见 https://uniapp.dcloud.net.cn/collocation/manifest.html#networktimeout
  timeout: 1000,

  // `adapter` 允许自定义处理请求
  // 可以指定为 'request'、'upload' 和 'download' 三者之一
  // 也可以指定为一个方法，返回一个 Promise 并提供一个有效的响应
  // 如果你正在使用 un.request、un.download、un.upload、un.get 等别名方法，则无需再指定该键的值
  // 默认值是 'request'
  adapter: (config) => { /* ... */ },

  // `validateStatus` 定义了对于给定的 HTTP 状态码该 resolve 还是 reject
  // 如果 `validateStatus` 返回 `true`、`null` 或 `undefined`
  // 则 promise 将会被 resolve，否则会被 reject
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // 用于取消请求
  // 可参考取消请求部分的说明
  signal: new AbortController().signal,

  // 用于取消请求
  // 可参考取消请求部分的说明
  cancelToken: new CancelToken(function (cancel) { /* ... */ }),

  // 监听 HTTP Response Header 事件
  // 会比请求完成事件更早
  onHeadersReceived: (result) => { /* ... */ },

  // request 使用
  // 创建请求时使用的方法
  // 默认值是 'GET'
  method: 'GET',

  // request 使用
  // `data` 是作为请求体被发送的数据
  // 必须是以下类型之一：string、object、ArrayBuffer、ArrayBufferView、URLSearchParams
  data: {
    firstName: 'Fred'
  },
  // 这也是可行的
  // data: 'Country=Brasil&City=Belo Horizonte',

  // request 使用
  // 返回的数据类型
  // 如果设置为 json，会尝试对返回的数据做一次 JSON.parse
  // 默认值是 'json'
  dataType: 'json',

  // request 使用
  // 响应的数据类型，选项包括 'text' 和 'arraybuffer'
  // 默认值是 'text'
  responseType: 'text',

  // request 使用
  // 是否开启 http2
  // 默认值是 false
  enableHttp2: false,

  // request 使用
  // 是否开启 quic
  // 默认值是 false
  enableQuic: false,

  // request 使用
  // 是否开启缓存
  // 默认值是 false
  enableCache: false,

  // request 使用
  // 是否开启 HttpDNS 服务
  // 默认值是 false
  enableHttpDNS: false,

  // request 使用
  // HttpDNS 服务商 Id
  httpDNSServiceId: '',

  // request 使用
  // 是否开启 transfer-encoding chunked
  // 默认值是 false
  enableChunked: false,

  // request 使用
  // 是否在 wifi 下使用移动网络发送请求
  // 默认值是 false
  forceCellularNetwork: false,

  // request 使用
  // 是否验证 ssl 证书
  // 默认值是 true
  sslVerify: true,

  // request 使用
  // 跨域请求时是否需要使用凭证
  // 默认值是 false
  withCredentials: false,

  // request 使用
  // 是否在 DNS 解析时优先使用 ipv4
  // 默认值是 false
  firstIpv4: false,

  // request 使用
  // 监听 Transfer-Encoding Chunk Received 事件
  // 当接收到新的 chunk 时触发
  onChunkReceived?: (response) => { /* ... */ },

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
  console.log('errMsg', response?.errMsg);
  console.log('errno', response?.errno);
  console.log('profile', response?.profile);
  console.log('config', response?.config);
  console.log('status', response?.status);
  console.log('statusText', response?.statusText);
  console.log('headers', response?.headers);
  console.log('data', response?.data);
  console.log('cookies', response?.cookies);
  console.log('tmpFilePath', response?.tmpFilePath);
  console.log('filePath', response?.filePath);
});
```

当使用 `catch`，或者传递一个 `rejection callback` 作为 `then` 的第二个参数时，响应可以作为 `error` 对象被使用，正如在 [错误处理](#错误处理) 部分解释的那样。

### 默认配置

你可以指定默认配置，它将作用于每个请求。

#### 全局配置默认值

```typescript
import { un } from '@uni-helper/uni-network';

un.defaults.baseUrl = 'https://api.example.com';
```

#### 自定义实例默认值

```typescript
import { un } from '@uni-helper/uni-network';

// 创建实例时配置默认值
const instance = un.create({
  baseUrl: 'https://api.example.com',
});

// 创建实例后修改默认值
instance.defaults.baseUrl = 'https://api.another-example.com';
```

#### 配置的优先级

配置将会按优先级进行合并。优先级从低到高是内置的默认值、实例的 `defaults` 配置、请求的 `config`。下面是一个例子。

```typescript
// 使用库提供的默认配置创建实例
// 此时超时配置的默认值是实际调用的 API 的默认值
const instance = un.create();

// 重写库的超时默认值
// 现在，所有使用此实例的请求都将等待 2.5 秒，然后才会超时
instance.defaults.timeout = 2500;

// 重写此请求的超时时间，因为该请求需要很长时间
instance.get('/longRequest', {
  timeout: 5000,
});
```

## 进阶

### 拦截器

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

#### 添加拦截器

可以全局添加请求或响应的拦截器。

```typescript
import { un } from '@uni-helper/uni-network';

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

也可以给自定义实例添加请求或响应的拦截器。

```typescript
import { un } from '@uni-helper/uni-network';

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

#### 移除拦截器

可以移除单个请求或响应的拦截器。

```typescript
import { un } from '@uni-helper/uni-network';

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
import { un } from '@uni-helper/uni-network';

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

#### 拦截器选项

当你添加请求拦截器时，`@uni-helper/uni-network` 默认认为它们是异步的。当主线程被阻塞时，这可能会导致 `@uni-helper/uni-network` 请求的执行延迟（底层为拦截器创建了一个 `Promise`，你的请求被放在了调用栈的底部）。

如果你的请求拦截器是同步的，你可以在选项对象中添加一个标志，告诉 `@uni-helper/uni-network` 同步运行代码，避免请求执行中的任何延迟。

```typescript
import { un } from '@uni-helper/uni-network';

un.interceptors.request.use(
  (config) => {
    config.headers.test = 'I am only a header!';
    return config;
  },
  null,
  { synchronous: true },
);
```

如果你想根据运行时检查来执行某个拦截器，你可以在 `options` 对象中设置 `runWhen` 函数。**当且仅当** `runWhen` 的返回值为 `false` 时，拦截器不会被执行。该函数将和 `config` 对象一起被调用（别忘了，你也可以绑定你自己的参数）。当你有一个只需要在特定时间运行的异步请求拦截器时，这可能会很方便。

```typescript
import { un } from '@uni-helper/uni-network';

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

- 按照添加的顺序执行每个拦截器
- 只返回最后一个拦截器的结果
- 每个拦截器都会收到其前一个拦截器的结果
- 当 `fulfilled` 拦截器抛出时
  - 后面的 `fulfilled` 拦截器不会被调用
  - 后面的 `rejection` 拦截器会被调用
  - 一旦被捕获，后面的另一个 `fulfilled` 拦截器会被再次调用（就像在一个 `Promise` 链中一样）

### 错误处理

默认把每一个返回的状态代码不在 2xx 范围内的响应视为错误。

```typescript
import { un } from '@uni-helper/uni-network';

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
import { un } from '@uni-helper/uni-network';

un.get('/user/12345', {
  validateStatus: (status) => {
    return status < 500; // 处理状态码小于 500 的情况
  },
});
```

如果你追求语义化，可以使用导出的和挂载的状态码、[statuses](https://github.com/jshttp/statuses)、[http-status-codes](https://github.com/prettymuchbryce/http-status-codes) 或 [node-http-status](https://github.com/adaltas/node-http-status)。

```typescript
import { un, HttpStatusCode } from '@uni-helper/uni-network';

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
import { un, isUnError } from '@uni-helper/uni-network';

un.get('/user/12345').catch((error) => {
  if (isUnError(error)) {
    /* ... */
  } else {
    /* ... */
  }
});
```

### 取消请求

#### AbortController

支持使用 [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求。要使用 AbortController，请使用 [abort-controller polyfill](https://github.com/mysticatea/abort-controller)。

- npm

  ```shell
  npm install abort-controller@^3.0.0
  ```

- yarn

  ```shell
  yarn add abort-controller@^3.0.0
  ```

- pnpm

  ```shell
  pnpm add abort-controller@^3.0.0
  ```

```typescript
import { un } from '@uni-helper/uni-network';
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

#### CancelToken

你也可以使用 `CancelToken` 来取消请求。

```typescript
import { un } from '@uni-helper/uni-network';

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

> 你可以用同一个 `CancelToken` / `AbortController` 取消几个请求。

> 如果在发起请求的时候已经取消请求，那么该请求就会被立即取消，不会真正发起请求。

### TypeScript 支持

`@uni-helper/uni-network` 使用 TypeScript 编写，你可以享受到完整的 TypeScript 支持。

最常见的一个类型问题是，调用 API 时得不到响应数据和发送数据的类型。

```typescript
import { un } from '@uni-helper/uni-network';

// response 的类型是 UnResponse<UnData, UnData>
// response.data 的类型是 UnData，你希望是 Record<string, any>
const response = await un({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 UnData，你希望是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

这可以通过设置两个范型类型来解决，两个范型类型依次分别对应响应数据和发送数据的类型。

```typescript
import { un } from '@uni-helper/uni-network';

// response 的类型是 UnResponse<Record<string, any>, Record<string, string>>
// response.data 的类型是 Record<string, any>
const response = await un<
  Record<string, any>, // 对应 response.data 类型
  Record<string, string> // 对应传参中 data 类型
>({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

而另一个常见的类型问题是，使用响应拦截器后响应类型不正确。

```typescript
import { un } from '@uni-helper/uni-network';

// 添加响应拦截器直接返回 response.data
un.interceptors.response.use((response) => response.data);

// response 的类型是 UnResponse<UnData, UnData>，你希望是 Record<string, any>
// response.data 的类型是 UnData，你希望是 Record<string, any>
const response = await un({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 UnData，你希望是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

这需要设置三个范型类型来解决，三个范型类型依次分别对应响应数据、发送数据、响应的类型。

```typescript
import { un } from '@uni-helper/uni-network';

// 添加响应拦截器直接返回 response.data
un.interceptors.response.use((response) => response.data);

// response 的类型是 Record<string, any>
// response.data 的类型是 Record<string, any>
const response = await un<
  Record<string, any>, // 对应 response.data 类型
  Record<string, string>, // 对应传参中 data 类型
  Record<string, any> // 对应 response 类型
>({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 Record<string, string>
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

> 如果你只想修改响应的类型，而不修改其它类型，你仍然需要书写三个范型类型。这和 `axios` 的范型类型设计不同，因为 `uni-app` 对数据类型有更严格的要求。

你可以从 `@uni-helper/uni-network` 中导入 `UnData` 以保持前两个范型类型的默认值。

```typescript
import { un, type UnData } from '@uni-helper/uni-network';

// 添加响应拦截器直接返回 response.data
un.interceptors.response.use((response) => response.data);

// response 的类型是 Record<string, any>
// response.data 的类型是 UnData
const response = await un<
  UnData, // 对应 response.data 类型
  UnData, // 对应传参中 data 类型
  Record<string, any> // 对应 response 类型
>({
  method: 'post',
  url: '/user/12345',
  // 以下 data 的类型是 UnData
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

### 高级功能

> 该部分目前较为简陋。欢迎 PR 贡献！🫡

对于缓存、去重、重试的高级功能，建议结合 [@tanstack/query](https://tanstack.com/query/)、[swrv](https://docs-swrv.netlify.app/)、[vue-request](https://www.attojs.com/)、[alova](https://alova.js.org/zh-CN/) 等库使用。

如果你不希望引入过多的库导致占用体积过多，你也可以参考以下内容以实现部分高级功能。

#### 缓存

请参考 [Axios 如何缓存请求数据](https://juejin.cn/post/6974902702400602148)。

#### 去重

请参考 [Axios 如何取消重复请求](https://juejin.cn/post/6955610207036801031) 和 [Axios 如何取消重复请求？取消重复请求方法有哪几种？](https://apifox.com/apiskills/axios-repeated-request/)。

#### 重试

请参考 [Axios 如何实现请求重试？](https://juejin.cn/post/6973812686584807432)。

#### 响应失败不抛出错误

在某些情况下，你可能不希望响应失败抛出错误，这时候可以使用响应拦截器来处理。

```typescript
import { un } from '@uni-helper/uni-network';

// 添加响应拦截器
un.interceptors.response.use(
  (response) => response,
  // 直接返回错误，不再需要使用 catch 来捕获
  // 需要注意返回值可能是 UnError 类型
  (error) => error,
);
```

#### 无感刷新登录态

在某些情况下，你可能希望无感刷新登录态，避免当前登录态过期后用户手动登录。

如果你有一个可以使用过期登录态换取新鲜登录态的接口，请参考 [uni-ajax - FAQ - 无感刷新 Token](https://uniajax.ponjs.com/guide/question#%E6%97%A0%E6%84%9F%E5%88%B7%E6%96%B0-token)。该部分代码实现略经修改也适用于使用双登录态的认证系统。

如果你正在使用一个使用双登录态的认证系统，请参考 [项目中前端如何实现无感刷新 token！](https://juejin.cn/post/7254572706536734781) 和 [基于 Axios 封装一个完美的双 token 无感刷新](https://juejin.cn/post/7271139265442021391)。

#### 全局请求加载

请参考 [uni-ajax - FAQ - 配置全局请求加载](https://uniajax.ponjs.com/guide/question#%E9%85%8D%E7%BD%AE%E5%85%A8%E5%B1%80%E8%AF%B7%E6%B1%82%E5%8A%A0%E8%BD%BD)。这类做法不适用于局部加载展示。

### 组合式函数

如果你还不了解组合式函数，请先阅读 [组合式 API 常见问答](https://cn.vuejs.org/guide/extras/composition-api-faq.html) 和 [组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)。

我们使用 [vue-demi](https://github.com/vueuse/vue-demi) 和 [vue-use](https://vueuse.org/) 来同时支持 `vue2` 和 `vue3`。请先阅读它们的使用说明。

- npm

  ```shell
  npm install @vueuse/core@^9.13.0
  ```

- yarn

  ```shell
  yarn add @vueuse/core@^9.13.0
  ```

- pnpm

  ```shell
  pnpm add @vueuse/core@^9.13.0
  ```

如果你希望使用 `@vueuse/core@^10.0.0`，请查看 [dcloudio/uni-app#4604](https://github.com/dcloudio/uni-app/issues/4604) 内提供的解决方案。

从 `@uni-helper/uni-network/composables` 中导入组合式函数后即可使用。

```typescript
import { useUn } from '@uni-helper/uni-network/composables';
```

`useUn` 的用法和 [useAxios](https://vueuse.org/integrations/useaxios/) 几乎完全一致。这里不再赘述。

## 其它

### 构建与环境支持

目前 `@uni-helper/uni-network` 会使用 `unbuild` 将 `uni` API 之外的部分转译到 `ES2017`（即 `ES8`）。`uni` API 需要在项目构建时由 `uni-app` 官方提供的插件处理。

如果你希望提供更好的兼容性，请参考 [这里](https://vitesse-docs.netlify.app/getting-started/deployment#%E5%85%BC%E5%AE%B9%E6%80%A7)。

### 比较

最常见的比较就是 `axios` 和 `@uni-helper/uni-network` 的比较。

`axios` 非常棒，`@uni-helper/uni-network` 的灵感也源于 `axios`，但 `axios` 存在几个相对严重的问题。

- `axios` 面向浏览器和 Node.js，即使使用了 `adapter`，某些底层功能也可能会在小程序内报错。
- `axios` 体积较大，会占用宝贵的小程序空间。
- 如果你想要获取良好的 TypeScript，你需要修改 `axios` 大部分类型定义。

如果你因为某些原因坚持使用 `axios`，你可以查看 [@uni-helper/axios-adapter](https://github.com/uni-helper/axios-adapter) 获取 `adapter` 支持。

以下是 `@uni-helper/uni-network` 与其它一些库的比较。如果你发现这里信息已经过时，欢迎提交 ISSUE 或 PR。
| | `axios` | `luch-request` | `uni-ajax` | `@uni-helper/uni-network` |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基本信息 | [![npm](https://img.shields.io/npm/v/axios)](https://www.npmjs.com/package/axios) [![npm](https://img.shields.io/npm/dw/axios)](https://www.npmjs.com/package/axios) | [![npm](https://img.shields.io/npm/v/luch-request)](https://www.npmjs.com/package/luch-request) [![npm](https://img.shields.io/npm/dw/luch-request)](https://www.npmjs.com/package/luch-request) | [![npm](https://img.shields.io/npm/v/uni-ajax)](https://www.npmjs.com/package/uni-ajax) [![npm](https://img.shields.io/npm/dw/uni-ajax)](https://www.npmjs.com/package/uni-ajax) | [![npm](https://img.shields.io/npm/v/@uni-helper/uni-network)](https://www.npmjs.com/package/@uni-helper/uni-network) [![npm](https://img.shields.io/npm/dw/@uni-helper/uni-network)](https://www.npmjs.com/package/@uni-helper/uni-network) |
| 开发语言 | JavaScript | JavaScript | JavaScript | TypeScript |
| 类型支持 | `index.d.ts`（没有考虑 `uni-app`） | `index.d.ts`（泛型支持较差） | `index.d.ts` | 包含 |
| 运行环境 | 浏览器和 `Node.js` | `uni-app` | `uni-app` | `uni-app` |
| `Promise` | √ | √ | √ | √ |
| `uni_modules` | × | √ | √ | × |
| `npm` 包 | √ | √ | √ | √ |
| 实例化 | √ | √ | √ | √ |
| 请求说明 | √ | √ | √ | √ |
| 请求头 headers | `AxiosHeaders` | 普通对象 | 普通对象 | 普通对象 |
| 请求参数 params | `AxiosURLSearchParams` | 普通对象 | 普通对象 | 普通对象或 `URLSearchParams` 对象 |
| 请求转换 `transformRequest` | √ | × | × | × |
| 响应说明 | √ | × | √ | √ |
| 响应转换 `transformResponse` | √ | × | × | × |
| 任务说明 | ×（没有考虑 `uni-app`  任务） | × | √（只有 `requestTask`  说明） | √（只有简单说明） |
| 适配器 | √（内置 `xhr` 和 `http`） | × | √ | √ |
| `uni.request` | ×（自行开发，还需要覆写类型） | √ | √ | √ |
| `uni.downloadFile` | ×（自行开发，还需要覆写类型） | √ | ×（自行开发，还需要覆写类型） | √ |
| `uni.uploadFile` | ×（自行开发，还需要覆写类型） | √ | ×（自行开发，还需要覆写类型） | √ |
| 请求拦截器 | √ | √ | √ | √ |
| 响应拦截器 | √ | √ | √ | √ |
| 配置说明 | √ | √ | √ | √ |
| 取消请求说明 | √ | × | √ | √ |
| 错误处理说明 | √ | × | √ | √ |
| 测试 | 完善 | 部分 | 无 | 部分 |
| 使用示例 | √ | √ | √ | √ |

## 资源

- [改动日志](https://github.com/uni-helper/uni-network/tree/main/CHANGELOG.md)

## 致谢

根据字母顺序排序。

- [@tanstack/query](https://tanstack.com/query/)
- [alova](https://alova.js.org/zh-CN/)
- [axios](https://axios-http.com/)
- [luch-request](https://github.com/lei-mu/luch-request)
- [swr](https://swr.vercel.app/)
- [swrv](https://docs-swrv.netlify.app/)
- [uni-ajax](https://uniajax.ponjs.com/)
- [vue-request](https://www.attojs.com/)
- [vue-use](https://vueuse.org/)
