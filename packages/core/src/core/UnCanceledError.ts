import type { UnConfig, UnData, UnTask } from "../types";
import { UnError } from "./UnError";

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

UnCanceledError.prototype.isUnCanceledError = true;

export { UnCanceledError };
