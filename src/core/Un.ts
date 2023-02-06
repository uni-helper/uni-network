import { buildFullPath, buildUrl, mergeConfig } from '../utils';
import type { UnConfig, UnData, UnResponse } from '../types';
import {
  UnInterceptorManager,
  UnInterceptorManagerHandlerFulfilled,
  UnInterceptorManagerHandlerRejected,
} from './UnInterceptorManager';
import { dispatchRequest } from './dispatchRequest';

export class Un<T = UnData, D = UnData> {
  defaults: UnConfig<T, D>;
  interceptors: {
    request: UnInterceptorManager<UnConfig<T, D>, T, D>;
    response: UnInterceptorManager<UnResponse<T, D>, T, D>;
  };

  constructor(instanceConfig: UnConfig<T, D>) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new UnInterceptorManager(),
      response: new UnInterceptorManager(),
    };
  }

  request(configOrUrl: string | UnConfig<T, D>, config?: UnConfig<T, D>) {
    const _config =
      typeof configOrUrl === 'string' ? { ...config, url: configOrUrl } : { ...configOrUrl };

    const mergedConfig = mergeConfig(this.defaults, _config);

    // filter out skipped interceptors
    const requestInterceptorChain: (
      | UnInterceptorManagerHandlerFulfilled<UnConfig<T, D>>
      | UnInterceptorManagerHandlerRejected
      | undefined
    )[] = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.each((interceptor) => {
      if (
        typeof interceptor.runWhen === 'function' &&
        interceptor.runWhen(mergedConfig) === false
      ) {
        return;
      }
      synchronousRequestInterceptors =
        synchronousRequestInterceptors && (interceptor?.synchronous ?? false);
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain: (
      | UnInterceptorManagerHandlerFulfilled<UnResponse<T, D>>
      | UnInterceptorManagerHandlerRejected
      | undefined
    )[] = [];
    this.interceptors.response.each((interceptor) => {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    // TODO: better types
    let promise: any;
    let i = 0;
    let len = 0;

    if (!synchronousRequestInterceptors) {
      const chain: (
        | UnInterceptorManagerHandlerFulfilled<UnConfig<T, D>>
        | UnInterceptorManagerHandlerRejected
        | UnInterceptorManagerHandlerFulfilled<UnResponse<T, D>>
        | UnInterceptorManagerHandlerRejected
        | undefined
      )[] = [dispatchRequest.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(mergedConfig);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = mergedConfig;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++] as UnInterceptorManagerHandlerFulfilled<
        UnConfig<T, D>
      >;
      const onRejected = requestInterceptorChain[i++] as UnInterceptorManagerHandlerRejected;
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  download(configOrUrl: string | UnConfig<T, D>, config?: UnConfig<T, D>) {
    return this.request(configOrUrl, { ...config, adapter: 'download' });
  }

  upload(configOrUrl: string | UnConfig<T, D>, config?: UnConfig<T, D>) {
    return this.request(configOrUrl, { ...config, adapter: 'upload' });
  }

  getUri(config: UnConfig<T, D>) {
    const mergedConfig = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(mergedConfig?.baseUrl ?? '', mergedConfig?.url ?? '');
    return buildUrl(fullPath, mergedConfig?.params, mergedConfig?.paramsSerializer);
  }
}

export interface Un<T = UnData, D = UnData> {
  // request<TT = T, DD = D, R = UnBaseResponse<TT, DD>>(
  //   configOrUrl: string | UnBaseConfig<TT, DD>,
  //   config?: UnBaseConfig<TT, DD>,
  // ): Promise<R>;

  request<TT = T, DD = D, R = UnResponse<TT, DD>>(config: UnConfig<TT, DD>): Promise<R>;
  download<TT = T, DD = D, R = UnResponse<TT, DD>>(config: UnConfig<TT, DD>): Promise<R>;
  upload<TT = T, DD = D, R = UnResponse<TT, DD>>(config: UnConfig<TT, DD>): Promise<R>;

  get<TT = T, DD = D, R = UnResponse<TT, DD>>(url: string, config?: UnConfig<TT, DD>): Promise<R>;
  delete<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;
  head<TT = T, DD = D, R = UnResponse<TT, DD>>(url: string, config?: UnConfig<TT, DD>): Promise<R>;
  options<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;
  trace<TT = T, DD = D, R = UnResponse<TT, DD>>(url: string, config?: UnConfig<TT, DD>): Promise<R>;
  connect<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;

  post<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    data?: DD,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;
  put<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    data?: DD,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;
  patch<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    data?: DD,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;
}

for (const method of ['delete', 'get', 'head', 'options', 'trace', 'connect'] as const) {
  Un.prototype[method] = function (url, config) {
    return this.request({
      ...config,
      method,
      url,
    });
  };
}

for (const method of ['post', 'put', 'patch'] as const) {
  Un.prototype[method] = function (url, data, config) {
    return this.request({
      ...config,
      method,
      url,
      data,
    });
  };
}
