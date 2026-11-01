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

// 系统时间中途回拨会让差值为负，夹到 0
const elapsedSince = (start: number) => Math.max(0, Date.now() - start);

/**
 * 拦截器链的最后一环：选好适配器真正发请求。
 *
 * 请求前和响应后都会再检查一次取消状态；如果是请求期间被取消，
 * 就直接抛 UnCanceledError，不再抛底层 API 的原始错误。
 *
 * 成功响应和带响应的失败都会写上 duration，用来评估适配器本身的耗时。
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

  const start = Date.now();

  return adapter(config).then(
    (response) => {
      throwIfCancellationRequested(config);

      response.duration = elapsedSince(start);

      return response;
    },
    (error) => {
      if (!isUnCancel(error)) {
        throwIfCancellationRequested(config);

        if (error?.response) {
          error.response.duration = elapsedSince(start);
        }
      }
      throw error;
    },
  );
};
