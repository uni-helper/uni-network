import type { UnConfig, UnData, UnResponse, UnTask } from "../types";

/**
 * 请求错误类。网络失败、超时、状态码不在 validateStatus 范围内等
 * 都会抛出这个错误，携带 code / config / task / response 等上下文。
 */
export class UnError<T = UnData, D = UnData> extends Error {
  // 错误码常量，和 axios 保持一致，方便按 code 分支处理
  static ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
  static ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  static ERR_BAD_OPTION = "ERR_BAD_OPTION";
  static ERR_NETWORK = "ERR_NETWORK";
  static ERR_DEPRECATED = "ERR_DEPRECATED";
  static ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  static ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  static ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
  static ERR_INVALID_URL = "ERR_INVALID_URL";
  static ERR_CANCELED = "ERR_CANCELED";
  static ECONNABORTED = "ECONNABORTED";
  static ETIMEDOUT = "ETIMEDOUT";
  static ECONNREFUSED = "ECONNREFUSED";

  code?: string;
  config?: UnConfig<T, D>;
  task?: UnTask;
  response?: UnResponse<T, D>;
  isUnError: boolean;
  status?: number;
  cause?: Error;

  constructor(
    message?: string,
    code?: string,
    config?: UnConfig<T, D>,
    task?: UnTask,
    response?: UnResponse<T, D>,
  ) {
    super(message);

    this.name = "UnError";

    this.code = code;
    this.config = config;
    this.task = task;
    if (response) {
      this.response = response;
      this.status = response.status ?? undefined;
    }

    this.isUnError = true;

    // cause 属性设为不可枚举：错误里套着 cause 时，JSON.stringify 会因为循环引用报错
    // https://github.com/axios/axios/pull/10913
    Object.defineProperty(this, "cause", {
      value: undefined,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  toJSON() {
    // 序列化用的对象，保留 message/stack/config/code/status 等关键信息
    return {
      message: this.message,
      name: this.name,
      // @ts-expect-error no types
      description: this.description,
      // @ts-expect-error no types
      number: this.number,
      // @ts-expect-error no types
      fileName: this.fileName,
      // @ts-expect-error no types
      lineNumber: this.lineNumber,
      // @ts-expect-error no types
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.status,
    } as {
      name: string;
      message?: string;
      stack?: string;
      config?: UnConfig<T, D>;
      code?: string;
      status?: number;
      [key: string]: any;
    };
  }

  /**
   * 把一个原生 Error 包装成 UnError，尽量保留原始错误的
   * name、status 和 cause，方便排查根因。
   */
  static from<TT = UnData, DD = UnData>(
    error?: Error,
    code?: string,
    config?: UnConfig<TT, DD>,
    task?: UnTask,
    response?: UnResponse<TT, DD>,
    customProps?: Record<string, any>,
  ) {
    const unError = new UnError(
      error?.message,
      // @ts-expect-error no types
      code || error?.code,
      config,
      task,
      response,
    );
    if (error && unError.cause == null) {
      unError.cause = error;
    }
    unError.name = error?.name ?? "Error";
    // @ts-expect-error no types
    if (error?.status != null && unError.status == null) {
      // @ts-expect-error no types
      unError.status = error.status;
    }
    if (customProps) {
      Object.assign(unError, customProps);
    }
    return unError;
  }
}
