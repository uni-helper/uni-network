import type { UnConfig, UnData, UnTask } from "../types";
import { UnError } from "./UnError";

/**
 * 取消请求时抛出的错误，是 UnError 的子类。
 *
 * 用 `isUnCancel` / `un.isCancel` 判断是否是主动取消。
 */
class UnCanceledError<T = UnData, D = UnData> extends UnError<T, D> {
  isUnCanceledError = true;

  constructor(message?: string, config?: UnConfig<T, D>, task?: UnTask) {
    super(message ?? "canceled");

    this.name = "CanceledError";
    this.message = message ?? "canceled";

    this.code = UnError.ERR_CANCELED;
    this.config = config;
    this.task = task;
  }
}

export { UnCanceledError };
