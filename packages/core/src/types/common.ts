// T 表示响应数据
// D 表示请求数据
export type UnData = string | Record<string, any> | ArrayBuffer;

export type UnMethod =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "trace"
  | "TRACE"
  | "connect"
  | "CONNECT";

export type UnHeaders = Record<string, any>;

export type UnParams = Record<string, any>;

export type UnParamsSerializer = (params?: UnParams) => string;

export type UnValidateStatus = (status: number) => boolean | null;

export interface UnGenericAbortSignal {
  readonly aborted: boolean;
  onabort?: ((...args: any) => any) | null;
  addEventListener?: (...args: any) => any;
  removeEventListener?: (...args: any) => any;
}

export type UnDataType = "json" | string;

export type UnResponseType = "text" | "arraybuffer";

export interface UnFile {
  name?: string;
  file?: File;
  uri?: string;
}

export type UnOnProgress = (response?: {
  /** 当前上传/下载百分比 */
  progress?: number;
  /** 已经上传的数据长度，单位 Bytes */
  totalBytesSent?: number;
  /** 预期需要上传的数据总长度，单位 Bytes */
  totalBytesExpectedToSend?: number;
  /** 已经下载的数据长度，单位 Bytes */
  totalBytesWritten?: number;
  /** 预期需要下载的数据总长度，单位 Bytes */
  totalBytesExpectedToWrite?: number;
}) => void;

export type UnFileType = "image" | "video" | "audio";

export interface UnProfile {
  /**
   * 第一个 HTTP 重定向发生时的时间
   *
   * 有跳转且是同域名内的重定向才算，否则值为 0
   */
  redirectStart?: number;
  /**
   * 最后一个 HTTP 重定向完成时的时间
   *
   * 有跳转且是同域名内部的重定向才算，否则值为 0
   */
  redirectEnd?: number;
  /** 组件准备好使用 HTTP 请求抓取资源的时间，这发生在检查本地缓存之前 */
  fetchStart?: number;
  /**
   * DNS 域名查询开始的时间
   *
   * 如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
   */
  domainLookupStart?: number;
  /**
   * DNS 域名查询完成的时间
   *
   * 如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
   */
  domainLookupEnd?: number;
  /**
   * HTTP（TCP） 开始建立连接的时间
   *
   * 如果是持久连接，则与 fetchStart 值相等
   *
   * 如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间
   */
  connectStart?: number;
  /**
   * HTTP（TCP） 完成建立连接的时间（完成握手）
   *
   * 如果是持久连接，则与 fetchStart 值相等
   *
   * 注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间
   *
   * 这里的完成握手包括安全连接建立完成、SOCKS 授权通过
   */
  connectEnd?: number;
  /**
   * SSL建立连接的时间
   *
   * 如果不是安全连接，则值为 0
   */
  SSLconnectionStart?: number;
  /**
   * SSL 建立完成的时间
   *
   * 如果不是安全连接，则值为 0
   */
  SSLconnectionEnd?: number;
  /**
   * HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存
   *
   * 连接错误重连时，这里显示的也是新建立连接的时间
   */
  requestStart?: number;
  /** HTTP 请求读取真实文档结束的时间 */
  requestEnd?: number;
  /** HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存 */
  responseStart?: number;
  /** HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存 */
  responseEnd?: number;
  /** 当次请求连接过程中实时 rtt */
  rtt?: number;
  /** 评估的网络状态 */
  estimate_nettype?: string | number;
  /** 协议层根据多个请求评估当前网络的 rtt（仅供参考） */
  httpRttEstimate?: number;
  /** 传输层根据多个请求评估的当前网络的 rtt（仅供参考） */
  transportRttEstimate?: number;
  /** 评估当前网络下载的 kbps */
  downstreamThroughputKbpsEstimate?: number;
  /** 当前网络的实际下载 kbps */
  throughputKbps?: number;
  /** 当前请求的 IP */
  peerIP?: string;
  /** 当前请求的端口 */
  port?: number;
  /** 是否复用连接 */
  socketReused?: boolean;
  /** 发送的字节数 */
  sendBytesCount?: number;
  /** 收到字节数 */
  receivedBytedCount?: number;
  /** 使用协议类型 */
  protocol?: "http1.1" | "h2" | "quic" | "unknown" | string;
}
