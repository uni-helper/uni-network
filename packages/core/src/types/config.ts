import type { UnCancelToken } from "../core/UnCancelToken";
import type { UnAdapter } from "./adapter";
import type {
  UnData,
  UnDataType,
  UnFile,
  UnFileType,
  UnGenericAbortSignal,
  UnHeaders,
  UnMethod,
  UnOnProgress,
  UnParams,
  UnParamsSerializer,
  UnResponseType,
  UnValidateStatus,
} from "./common";

export interface UnConfig<T = UnData, D = UnData> {
  /** 用于请求的服务器 URL */
  url?: string;
  /**
   * 创建请求时使用的方法
   *
   * 默认为 'GET'
   */
  method?: UnMethod;
  /** 自动加在 `url` 前面，除非 `url` 是一个绝对 URL 且选项 `allowAbsoluteUrls` 为 true */
  baseUrl?: string;
  /**
   * 决定是否允许绝对 URL 覆盖配置的 `baseUrl`
   *
   * 当设置为 true（默认）时，绝对值的 `url` 会覆盖 `baseUrl`
   *
   * 当设置为 false 时，绝对值的 `url` 会始终被 `baseUrl` 前置
   */
  allowAbsoluteUrls?: boolean;
  /** 自定义请求头，不能设置 Referer */
  headers?: UnHeaders;
  /** 与请求一起发送的 URL 参数 */
  params?: UnParams;
  /**
   * 可选方法，主要用于序列化 `params`
   *
   * 默认使用 [fast-querystring](https://github.com/anonrig/fast-querystring)
   * 序列化，需要自行处理嵌套值
   *
   * [picoquery](https://github.com/43081j/picoquery) 在 fast-querystring
   * 基础上支持嵌套值、增加可配置性
   *
   * [qs](https://github.com/ljharb/qs) 包含大量无用的兼容代码，占用额外体积，如无必要不建议使用
   *
   * [qs](https://github.com/ljharb/qs) v6.10.0 引入了 `get-intrinsic`
   * 导致结合微信小程序和微信小程序插件使用时出现报错，可使用 v6.9.7
   *
   * [query-string](https://github.com/sindresorhus/query-string) 体积性能都较好，支持完善
   *
   * [query-string](https://github.com/sindresorhus/query-string) 基于
   * [decode-uri-component](https://github.com/SamVerschueren/decode-uri-component)，它使用了部分小程序（如支付宝小程序）不支持的语法（可选的
   * catch 参数，Optional catch Binding），需自行修改处理
   */
  paramsSerializer?: UnParamsSerializer;
  /**
   * 作为请求体被发送的数据
   *
   * 必须是以下类型之一：string、ArrayBuffer、Record<string, any>
   */
  data?: D;
  /**
   * 指定请求超时的毫秒数
   *
   * 如果请求时间超过 `timeout` 的值，则请求会被中断
   *
   * 要设置永不超时，可以将其设置为 Number.POSITIVE_INFINITY
   *
   * 默认值是实际调用的 API 的默认值
   */
  timeout?: number;
  /**
   * 允许自定义处理请求
   *
   * 可以指定为 'request'、`upload` 和 `download` 三者之一
   *
   * 也可以指定为一个方法，返回一个 Promise 并提供一个有效的响应
   *
   * 如果你正在使用 un.request、un.download、un.upload、un.get 等别名方法，则无需再指定该键的值
   *
   * 默认为 'request'
   */
  adapter?: "request" | "download" | "upload" | UnAdapter<T, D>;
  /**
   * 定义了对于给定的 HTTP 状态码该 resolve 还是 reject
   *
   * 如果 `validateStatus` 返回 `true`、`null` 或 `undefined`
   *
   * 则 promise 将会被 resolve，否则会被 reject
   *
   * 默认为 (status) => status >= 200 && status < 300
   */
  validateStatus?: UnValidateStatus;
  /** 用于取消请求 */
  signal?: UnGenericAbortSignal;
  /** 用于取消请求 */
  cancelToken?: UnCancelToken<T, D>;
  /**
   * 监听 HTTP Response Header 事件
   *
   * 会比请求完成事件更早
   */
  onHeadersReceived?: (response?: { headers?: UnHeaders }) => void;

  /**
   * Request 使用
   *
   * 服务器返回数据的类型
   *
   * 如果设置为 json，会尝试对返回的数据做一次 JSON.parse
   *
   * 默认为 json
   */
  dataType?: UnDataType;
  /**
   * Request 使用
   *
   * 响应的数据类型
   *
   * 默认为 text
   */
  responseType?: UnResponseType;
  /**
   * Request 使用
   *
   * 是否开启 http2
   *
   * 默认为 false
   */
  enableHttp2?: boolean;
  /**
   * Request 使用
   *
   * 是否开启 quic
   *
   * 默认为 false
   */
  enableQuic?: boolean;
  /**
   * Request 使用
   *
   * 是否开启缓存
   *
   * 默认为 false
   */
  enableCache?: boolean;
  /**
   * Request 使用
   *
   * 是否开启 HttpDNS 服务
   *
   * 默认为 false
   */
  enableHttpDNS?: boolean;
  /**
   * Request 使用
   *
   * HttpDNS 服务商 Id
   */
  httpDNSServiceId?: string;
  /**
   * Request 使用
   *
   * 是否开启 transfer-encoding chunked
   *
   * 默认为 false
   */
  enableChunked?: boolean;
  /**
   * Request 使用
   *
   * 是否在 wifi 下使用移动网络发送请求
   *
   * 默认为 false
   */
  forceCellularNetwork?: boolean;
  /**
   * Request 使用
   *
   * 是否验证 ssl 证书
   *
   * 默认为 true
   */
  sslVerify?: boolean;
  /**
   * Request 使用
   *
   * 跨域请求时是否需要使用凭证
   *
   * 默认为 false
   */
  withCredentials?: boolean;
  /**
   * Request 使用
   *
   * 是否在 DNS 解析时优先使用 ipv4
   *
   * 默认为 false
   */
  firstIpv4?: boolean;
  /**
   * Request 使用
   *
   * 监听 Transfer-Encoding Chunk Received 事件
   *
   * 当接收到新的 chunk 时触发
   */
  onChunkReceived?: (response?: { data?: ArrayBuffer }) => void;

  /**
   * Upload 使用
   *
   * 需要上传的文件列表，files 和 filePath 必填一个
   *
   * 使用该参数时，filePath 和 name 无效
   *
   * 不支持小程序
   */
  files?: UnFile[];
  /**
   * Upload 使用
   *
   * 文件类型
   */
  fileType?: UnFileType;
  /**
   * Upload 使用
   *
   * 文件对象
   */
  file?: File;
  /**
   * Upload 使用
   *
   * 文件路径，files 和 filePath 必填一个
   *
   * Download 使用
   *
   * 文件下载后存储的本地路径
   */
  filePath?: string;
  /**
   * Upload 使用
   *
   * 文件名称
   */
  name?: string;
  /**
   * Upload 使用
   *
   * 一个对象，会作为 HTTP 请求中其它额外的 form data
   */
  formData?: Record<string, any>;
  /**
   * Download 使用
   *
   * 下载进度变化时触发
   *
   * 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress >
   * onProgressUpdate
   */
  onDownloadProgress?: UnOnProgress;
  /**
   * Download 使用
   *
   * 下载进度变化时触发
   *
   * 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress >
   * onProgressUpdate
   */
  onDownloadProgressUpdate?: UnOnProgress;
  /**
   * Upload 使用
   *
   * 上传进度变化时触发
   *
   * 优先级 onUploadProgress > onUploadProgressUpdate > onProgress >
   * onProgressUpdate
   */
  onUploadProgress?: UnOnProgress;
  /**
   * Upload 使用
   *
   * 上传进度变化时触发
   *
   * 优先级 onUploadProgress > onUploadProgressUpdate > onProgress >
   * onProgressUpdate
   */
  onUploadProgressUpdate?: UnOnProgress;
  /**
   * Upload / download 使用
   *
   * 上传/下载进度变化时触发
   *
   * 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate /
   * onDownloadProgressUpdate > onProgress > onProgressUpdate
   */
  onProgress?: UnOnProgress;
  /**
   * Upload / download 使用
   *
   * 上传/下载进度变化时触发
   *
   * 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate /
   * onDownloadProgressUpdate > onProgress > onProgressUpdate
   */
  onProgressUpdate?: UnOnProgress;
  [key: string]: any;
}
