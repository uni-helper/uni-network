import { adapters, requestAdapter } from "../adapters";
import type { UnConfig, UnData } from "../types";
import { isUnCancel } from "./isUnCancel";
import { UnCanceledError } from "./UnCanceledError";

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
