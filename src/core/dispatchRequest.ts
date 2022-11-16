import { adapters, requestAdapter } from '../adapters';
import { UnAdapter, UnConfig, UnData } from '../types';
import { isUnCancel } from './isUnCancel';
import { UnCanceledError } from './UnCanceledError';

const throwIfCancellationRequested = <T = UnData, D = UnData>(config: UnConfig<T, D>) => {
  if (config.cancelToken) {
    config.cancelToken?.throwIfRequested();
  }

  if (config.signal?.aborted) {
    throw new UnCanceledError();
  }
};

export const dispatchRequest = <T = UnData, D = UnData>(config: UnConfig<T, D>) => {
  throwIfCancellationRequested(config);

  const adapter = (
    typeof config.adapter === 'string' && adapters[config.adapter]
      ? adapters[config.adapter]
      : typeof config.adapter === 'function'
      ? config.adapter
      : requestAdapter
  ) as UnAdapter<T, D>;

  return adapter(config).then(
    (response) => {
      throwIfCancellationRequested(config);
      return response;
    },
    (reason) => {
      if (!isUnCancel(reason)) {
        throwIfCancellationRequested(config);
      }
      return Promise.reject(reason);
    },
  );
};
