# 请求配置

以下是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method` 且没有指定 `adapter`，请求将默认使用 `GET` 方法。

```typescript
{
  // `url` 是用于请求的服务器 URL
  url: "/user",

  // `baseUrl` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL 且选项 `allowAbsoluteUrls` 为 true
  // 设置一个 `baseUrl` 便于为实例方法传递相对 URL
  baseUrl: "https://some-domain.com/api/",

  // 决定是否允许绝对 URL 覆盖配置的 `baseUrl`
  // 当设置为 true（默认）时，绝对值的 `url` 会覆盖 `baseUrl`
  // 当设置为 false 时，绝对值的 `url` 会始终被 `baseUrl` 前置
  allowAbsoluteUrls?: boolean;

  // 自定义请求头
  // 不能设置 Referer
  headers: {
    "content-type": "application/json",
  },

  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个普通对象或一个 URLSearchParams 对象
  // 要使用 URLSearchParams 对象，请使用 core-js 提供的 polyfill
  // 可参考构建与环境支持部分的说明或该仓库提供的 playground
  params: {
    ID: "12345",
  },

  // `paramsSerializer` 是可选方法，主要用于序列化 `params`
  // 默认使用 [fast-querystring](https://github.com/anonrig/fast-querystring) 序列化，需要自行处理嵌套值
  // [picoquery](https://github.com/43081j/picoquery) 在 fast-querystring 基础上支持嵌套值、增加可配置性
  // [qs](https://github.com/ljharb/qs) 包含大量无用的兼容代码，占用额外体积，如无必要不建议使用
  // [qs](https://github.com/ljharb/qs) v6.10.0 引入了 `get-intrinsic` 导致结合微信小程序和微信小程序插件使用时出现报错，可使用 v6.9.7
  // [query-string](https://github.com/sindresorhus/query-string) 体积性能都较好，支持完善
  // [query-string](https://github.com/sindresorhus/query-string) 基于 [decode-uri-component](https://github.com/SamVerschueren/decode-uri-component)，它使用了部分小程序（如支付宝小程序）不支持的语法（可选的 catch 参数，Optional catch Binding），需自行修改处理
  paramsSerializer: (params) => {
    /* 返回一个字符串 */
  },

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
  adapter: (config) => {
    /* ... */
  },

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
  cancelToken: new CancelToken(function (cancel) {
    /* ... */
  }),

  // 监听 HTTP Response Header 事件
  // 会比请求完成事件更早
  onHeadersReceived: (result) => {
    /* ... */
  },

  // request 使用
  // 创建请求时使用的方法
  // 默认值是 'GET'
  method: "GET",

  // request 使用
  // `data` 是作为请求体被发送的数据
  // 必须是以下类型之一：string、object、ArrayBuffer、ArrayBufferView、URLSearchParams
  data: {
    firstName: "Fred",
  },
  // 这也是可行的
  // data: 'Country=Brasil&City=Belo Horizonte',

  // request 使用
  // 返回的数据类型
  // 如果设置为 json，会尝试对返回的数据做一次 JSON.parse
  // 默认值是 'json'
  dataType: "json",

  // request 使用
  // 响应的数据类型，选项包括 'text' 和 'arraybuffer'
  // 默认值是 'text'
  responseType: "text",

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
  httpDNSServiceId: "",

  // request 使用
  // 是否开启 transfer-encoding chunked
  // 默认值是 false
  enableChunked: false,

  // request 使用
  // 是否在 wifi 下使用移动网络发送请求
  // 默认值是 false
  forceCellularNetwork: false,

  // request 使用
  // 监听 Transfer-Encoding Chunk Received 事件
  // 当接收到新的 chunk 时触发
  onChunkReceived: (response) => {
    /* ... */
  },

  // Request 使用
  // 是否可在 headers 中编辑 cookie
  // 默认为 false
  enableCookie?: boolean;

  // Request 使用
  // 是否开启云加速
  // 默认为 false
  cloudCache?: boolean | {
    // 用于指定 query 中哪些字段不作为缓存依据
    excludeURLQueries?: string[];
    // 用于表达云加速缓存的最快刷新时间
    // 单位 s
    minRefresh?: number;
    [key: string]: any;
  };

  // Request 使用
  // 控制当前请求是否延时至首屏内容渲染后发送
  // 默认为 false
  defer?: boolean;

  // upload 使用
  // 需要上传的文件列表，files 和 filePath 必填一个
  // 使用该参数时，filePath 和 name 无效
  // 不支持小程序
  files: [],

  // upload 使用
  // 文件类型
  fileType: "image", // image, video, audio

  // upload 使用
  // 文件对象
  file: new File(),

  // upload 使用
  // 文件路径，files 和 filePath 必填一个
  //
  // download 使用
  // 文件下载后存储的本地路径
  filePath: "/fake/path",

  // upload 使用
  // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
  name: "file",

  // upload 使用
  // 一个对象，会作为 HTTP 请求中其它额外的 form data
  formData: Record<string, any>,

  // download 使用
  // 下载进度变化时触发
  // 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress > onProgressUpdate
  onDownloadProgress: UnOnProgress,

  // download 使用
  // 下载进度变化时触发
  // 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress > onProgressUpdate
  onDownloadProgressUpdate: UnOnProgress,

  // upload 使用
  // 上传进度变化时触发
  // 优先级 onUploadProgress > onUploadProgressUpdate > onProgress > onProgressUpdate
  onUploadProgress: UnOnProgress,

  // upload 使用
  // 上传进度变化时触发
  // 优先级 onUploadProgress > onUploadProgressUpdate > onProgress > onProgressUpdate
  onUploadProgressUpdate: UnOnProgress,

  // upload / download 使用
  // 上传/下载进度变化时触发
  // 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate / onDownloadProgressUpdate > onProgress > onProgressUpdate
  onProgress: UnOnProgress,

  // upload / download 使用
  // 上传/下载进度变化时触发
  // 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate / onDownloadProgressUpdate > onProgress > onProgressUpdate
  onProgressUpdate: UnOnProgress,
};
```
