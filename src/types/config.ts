import { UnCancelToken } from '../core/UnCancelToken';
import type {
  UnData,
  UnHeaders,
  UnMethod,
  UnDataType,
  UnResponseType,
  UnGenericAbortSignal,
  UnOnProgress,
  UnFileType,
  UnParamsSerializer,
  UnValidateStatus,
  UnFile,
  UnParams,
} from './common';
import type { UnAdapter } from './adapter';

export interface UnConfig<T = UnData, D = UnData> {
  /** 用于请求的服务器 URL */
  url?: string;
  /**
   * 创建请求时使用的方法
   *
   * 默认为 GET
   */
  method?: UnMethod;
  /** 自动加在 `url` 前面，除非 `url` 是一个绝对 URL */
  baseUrl?: string;
  /** 自定义请求头，不能设置 Referer */
  headers?: UnHeaders;
  /** 与请求一起发送的 URL 参数 */
  params?: UnParams;
  /**
   * 可选方法，主要用于序列化 `params`
   *
   * 默认使用 [query-string](https://github.com/sindresorhus/query-string) 序列化
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
   * 默认为 request
   */
  adapter?: 'request' | 'download' | 'upload' | UnAdapter<T, D>;
  /**
   * 定义了对于给定的 HTTP 状态码是 resolve 还是 reject
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
   * 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress > onProgressUpdate
   */
  onDownloadProgress?: UnOnProgress;
  /**
   * Download 使用
   *
   * 下载进度变化时触发
   *
   * 优先级 onDownloadProgress > onDownloadProgressUpdate > onProgress > onProgressUpdate
   */
  onDownloadProgressUpdate?: UnOnProgress;
  /**
   * Upload 使用
   *
   * 上传进度变化时触发
   *
   * 优先级 onUploadProgress > onUploadProgressUpdate > onProgress > onProgressUpdate
   */
  onUploadProgress?: UnOnProgress;
  /**
   * Upload 使用
   *
   * 上传进度变化时触发
   *
   * 优先级 onUploadProgress > onUploadProgressUpdate > onProgress > onProgressUpdate
   */
  onUploadProgressUpdate?: UnOnProgress;
  /**
   * Upload / download 使用
   *
   * 上传/下载进度变化时触发
   *
   * 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate / onDownloadProgressUpdate >
   * onProgress > onProgressUpdate
   */
  onProgress?: UnOnProgress;
  /**
   * Upload / download 使用
   *
   * 上传/下载进度变化时触发
   *
   * 优先级 onUploadProgress / onDownloadProgress > onUploadProgressUpdate / onDownloadProgressUpdate >
   * onProgress > onProgressUpdate
   */
  onProgressUpdate?: UnOnProgress;
  [key: string]: any;
}
