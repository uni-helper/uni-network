import type { UnConfig, UnData, UnResponse } from "../types";
import { buildFullPath, buildUrl, mergeConfig } from "../utils";
import {
  UnInterceptorManager,
  type UnInterceptorManagerHandlerFulfilled,
  type UnInterceptorManagerHandlerRejected,
} from "./UnInterceptorManager";
import { dispatchRequest } from "./dispatchRequest";

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

  private _request<TT = T, DD = D, R = UnResponse<TT, DD>>(
    configOrUrl: string | UnConfig<TT, DD>,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    const _config =
      typeof configOrUrl === "string"
        ? { ...config, url: configOrUrl }
        : { ...configOrUrl, ...config };

    const mergedConfig = mergeConfig<any, any>(this.defaults, _config);

    // filter out skipped interceptors
    const requestInterceptorChain: (
      | UnInterceptorManagerHandlerFulfilled<UnConfig<T, D>>
      | UnInterceptorManagerHandlerRejected
      | undefined
    )[] = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.each((interceptor) => {
      if (
        typeof interceptor.runWhen === "function" &&
        interceptor.runWhen(mergedConfig) === false
      ) {
        return;
      }
      synchronousRequestInterceptors =
        synchronousRequestInterceptors && (interceptor?.synchronous ?? false);
      requestInterceptorChain.unshift(
        interceptor.fulfilled,
        interceptor.rejected,
      );
    });

    const responseInterceptorChain: (
      | UnInterceptorManagerHandlerFulfilled<UnResponse<T, D>>
      | UnInterceptorManagerHandlerRejected
      | undefined
    )[] = [];
    this.interceptors.response.each((interceptor) => {
      responseInterceptorChain.push(
        interceptor.fulfilled,
        interceptor.rejected,
      );
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
      const onFulfilled = requestInterceptorChain[
        i++
      ] as UnInterceptorManagerHandlerFulfilled<UnConfig<T, D>>;
      const onRejected = requestInterceptorChain[
        i++
      ] as UnInterceptorManagerHandlerRejected;
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
      promise = promise.then(
        responseInterceptorChain[i++],
        responseInterceptorChain[i++],
      );
    }

    return promise;
  }

  async request<TT = T, DD = D, R = UnResponse<TT, DD>>(
    configOrUrl: string | UnConfig<TT, DD>,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    try {
      return await this._request(configOrUrl, config);
    } catch (error) {
      if (error instanceof Error) {
        let dummy: any = {};
        Error.captureStackTrace
          ? Error.captureStackTrace(dummy)
          : // biome-ignore lint/suspicious/noAssignInExpressions: follow axios implementation
            (dummy = new Error());
        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        if (!error.stack) {
          error.stack = stack;
          // match without the 2 top stack lines
        } else if (
          stack &&
          !String(error.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))
        ) {
          error.stack += `\n${stack}`;
        }
      }
      throw error;
    }
  }

  download<TT = T, DD = D, R = UnResponse<TT, DD>>(
    configOrUrl: string | UnConfig<TT, DD>,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request(configOrUrl, { ...config, adapter: "download" });
  }

  upload<TT = T, DD = D, R = UnResponse<TT, DD>>(
    configOrUrl: string | UnConfig<TT, DD>,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request(configOrUrl, { ...config, adapter: "upload" });
  }

  get<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "GET",
      url,
    });
  }

  delete<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "DELETE",
      url,
    });
  }

  head<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "HEAD",
      url,
    });
  }

  options<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "OPTIONS",
      url,
    });
  }

  trace<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "TRACE",
      url,
    });
  }

  connect<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "CONNECT",
      url,
    });
  }

  post<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    data?: DD,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "POST",
      url,
      data,
    });
  }

  put<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    data?: DD,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "PUT",
      url,
      data,
    });
  }

  patch<TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    data?: DD,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    return this.request({
      ...config,
      method: "PATCH",
      url,
      data,
    });
  }

  getUri(config: UnConfig<T, D>) {
    const mergedConfig = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(
      mergedConfig?.baseUrl ?? "",
      mergedConfig?.url ?? "",
    );
    return buildUrl(
      fullPath,
      mergedConfig?.params,
      mergedConfig?.paramsSerializer,
    );
  }
}
