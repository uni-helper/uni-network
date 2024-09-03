import type { UnData, UnHeaders, UnProfile } from "./common";
import type { UnConfig } from "./config";
import type { UnTask } from "./task";

export interface UnResponse<T = UnData, D = UnData> {
  /** 错误信息 */
  errMsg?: string;
  /** 错误代码 */
  errno?: number;
  /** 网络请求过程中的调试信息 */
  profile?: UnProfile;

  /** 请求的配置信息 */
  config?: UnConfig<T, D>;
  /** 对应的 task 信息 */
  task?: UnTask;

  /** 服务器响应的 HTTP 状态码 */
  status?: number;
  /** 服务器响应的 HTTP 状态信息 */
  statusText?: string;
  /** 服务器响应头 */
  headers?: UnHeaders;
  /** 服务器响应数据 */
  data?: T;

  /**
   * Request 特有
   *
   * 服务器提供的 cookies 数据
   */
  cookies?: string[];
  /**
   * Download 特有
   *
   * 临时本地文件路径
   *
   * 没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件
   */
  tempFilePath?: string;
  /**
   * Download 特有
   *
   * 用户本地文件路径
   *
   * 传入 filePath 时会返回，跟传入的 filePath 一致
   */
  filePath?: string;
}
