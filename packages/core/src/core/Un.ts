import type { UnConfig, UnData, UnResponse } from "../types";
import { buildFullPath, buildUrl, mergeConfig } from "../utils";
import { dispatchRequest } from "./dispatchRequest";
import {
  UnInterceptorManager,
  type UnInterceptorManagerHandlerFulfilled,
  type UnInterceptorManagerHandlerRejected,
} from "./UnInterceptorManager";

/**
 * 请求核心类，类似 axios 的 Axios 类。
 *
 * 持有实例默认配置和请求/响应拦截器，所有别名方法（get/post/download 等）
 * 最终都会走到 `_request`：合并配置 → 穿过请求拦截器 → dispatchRequest 发请求
 * → 穿过响应拦截器。
 */
export class Un<T = UnData, D = UnData> {
  /** 实例默认配置，每次请求都会和传入的 config 合并 */
  defaults: UnConfig<T, D>;

  interceptors: {
    request: UnInterceptorManager<UnConfig<T, D>, T, D>;
    response: UnInterceptorManager<UnResponse<T, D>, T, D>;
  };

  constructor(instanceConfig?: UnConfig<T, D>) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new UnInterceptorManager(),
      response: new UnInterceptorManager(),
    };
  }

  /**
   * 真正的发请求逻辑，request() 只是包了一层错误堆栈装饰。
   *
   * 请求拦截器默认异步执行（走 Promise 链）；如果所有拦截器都声明了
   * `synchronous: true`，则同步执行以减少延迟，失败时靠配对的 onRejected
   * 恢复后才继续发请求。
   */
  private _request<TT = T, DD = D, R = UnResponse<TT, DD>>(
    configOrUrl: string | UnConfig<TT, DD>,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    const _config =
      typeof configOrUrl === "string"
        ? { ...config, url: configOrUrl }
        : { ...configOrUrl, ...config };

    const mergedConfig = mergeConfig<any, any>(this.defaults, _config);

    // 收集请求拦截器。注意 unshift：请求拦截器要按注册顺序的反方向
    // 穿过 config（先注册的最先执行），所以倒序塞进链里
    // runWhen 返回 false 的拦截器这次请求会被跳过
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

    // 响应拦截器按注册顺序依次执行，直接 push 即可
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
    let recoveredPromise: Promise<any> | undefined;

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
        // 同步拦截器抛错后，只有在配套的失败处理函数成功返回时才继续发请求
        // https://github.com/axios/axios/pull/11071
        if (typeof onRejected !== "function") {
          return Promise.reject(error);
        }
        recoveredPromise = Promise.resolve().then(() =>
          onRejected.call(this, error),
        );
        break;
      }
    }

    if (recoveredPromise) {
      promise = recoveredPromise.then((resolvedConfig) =>
        dispatchRequest.call(this, resolvedConfig),
      );
    } else {
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
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

  /**
   * 发起请求。出错时把调用点的堆栈拼接到错误堆栈上，
   * 方便定位是哪行业务代码发起的请求。
   */
  async request<TT = T, DD = D, R = UnResponse<TT, DD>>(
    configOrUrl: string | UnConfig<TT, DD>,
    config?: UnConfig<TT, DD>,
  ): Promise<R> {
    try {
      return await this._request(configOrUrl, config);
    } catch (error) {
      if (error instanceof Error) {
        let dummy: any = {};
        let stack = "";
        try {
          Error.captureStackTrace
            ? Error.captureStackTrace(dummy)
            : // biome-ignore lint/suspicious/noAssignInExpressions: follow axios implementation
              (dummy = new Error());
          // dummy.stack 某些环境下不是字符串，先判断类型再切片
          // https://github.com/axios/axios/pull/11109
          if (typeof dummy.stack === "string") {
            const firstNewlineIndex = dummy.stack.indexOf("\n");
            stack =
              firstNewlineIndex === -1
                ? ""
                : dummy.stack.slice(firstNewlineIndex + 1);
          }

          if (!error.stack) {
            error.stack = stack;
          } else if (stack) {
            const firstNewlineIndex = stack.indexOf("\n");
            const secondNewlineIndex =
              firstNewlineIndex === -1
                ? -1
                : stack.indexOf("\n", firstNewlineIndex + 1);
            // 拿掉堆栈里自己这两行，只保留调用点信息，避免堆栈越拼越长
            const stackWithoutTwoTopLines =
              secondNewlineIndex === -1
                ? ""
                : stack.slice(secondNewlineIndex + 1);
            if (!String(error.stack).endsWith(stackWithoutTwoTopLines)) {
              error.stack += `\n${stack}`;
            }
          }
        } catch (_) {
          // 忽略自定义 stack hook 或 stack 不可写导致的失败
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

  /** 合并默认配置后生成完整的请求地址（含 baseUrl 和 params），不发请求 */
  getUri(config: UnConfig<T, D>) {
    const mergedConfig = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(
      mergedConfig?.baseUrl ?? "",
      mergedConfig?.url ?? "",
      mergedConfig?.allowAbsoluteUrls ?? true,
      mergedConfig,
    );
    return buildUrl(
      fullPath,
      mergedConfig?.params,
      mergedConfig?.paramsSerializer,
    );
  }
}
