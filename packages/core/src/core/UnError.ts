import type { UnConfig, UnData, UnResponse, UnTask } from "../types";

export class UnError<T = UnData, D = UnData> extends Error {
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
    this.message = message ?? "";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }

    this.code = code;
    this.config = config;
    this.task = task;
    if (response) {
      this.response = response;
      this.status = response.status ?? undefined;
    }

    this.isUnError = true;
  }

  toJSON() {
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

  static from<TT = UnData, DD = UnData>(
    error?: Error,
    code?: string,
    config?: UnConfig<TT, DD>,
    task?: UnTask,
    response?: UnResponse<TT, DD>,
    customProps?: Record<string, any>,
  ) {
    const unError = new UnError(error?.message, code, config, task, response);
    if (customProps) {
      Object.assign(unError, customProps);
    }
    return unError;
  }
}
