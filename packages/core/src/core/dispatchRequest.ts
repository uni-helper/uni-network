import { adapters, requestAdapter } from "../adapters";
import type { UnConfig, UnData } from "../types";
import { isUnCancel } from "./isUnCancel";
import { UnCanceledError } from "./UnCanceledError";

// 发请求前检查是否已取消；已取消就直接抛错，不真正发请求
const throwIfCancellationRequested = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
) => {
  if (config.cancelToken) {
    config.cancelToken?.throwIfRequested();
  }

  if (config.signal?.aborted) {
    throw new UnCanceledError();
  }
};

/**
 * 拦截器链的最后一环：选好适配器真正发请求。
 *
 * 请求前和响应后都会再检查一次取消状态；如果是请求期间被取消，
 * 就直接抛 UnCanceledError，不再抛底层 API 的原始错误。
 */
export const dispatchRequest = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
) => {
  throwIfCancellationRequested(config);

  let adapter = requestAdapter<T, D>;
  if (typeof config.adapter === "string" && adapters[config.adapter]) {
    adapter = adapters[config.adapter];
  } else if (typeof config.adapter === "function") {
    adapter = config.adapter;
  }

  return adapter(config).then(
    (response) => {
      throwIfCancellationRequested(config);
      return response;
    },
    (error) => {
      if (!isUnCancel(error)) {
        throwIfCancellationRequested(config);
      }
      throw error;
    },
  );
};
