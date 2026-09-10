import type { UnConfig, UnData, UnTask } from "../types";
import { UnCanceledError } from "./UnCanceledError";

export interface UnCancel {
  message?: string;
}

export interface UnCancelStatic {
  new (message?: string): UnCancel;
}

export type UnCanceler<T = UnData, D = UnData> = (
  message?: string,
  config?: UnConfig<T, D>,
  task?: UnTask,
) => void;

export type UnCancelTokenListener = (
  reason: UnCancel | PromiseLike<UnCancel>,
) => void;

export interface UnCancelTokenSource<T = UnData, D = UnData> {
  token: UnCancelToken;
  cancel: UnCanceler<T, D>;
}

export interface UnCancelTokenStatic<T = UnData, D = UnData> {
  new (executor: (cancel: UnCanceler<T, D>) => void): UnCancelToken<T, D>;
  source: () => UnCancelTokenSource<T, D>;
}

/**
 * 取消令牌，用法和 axios 的 CancelToken 一致。
 *
 * 通过 `source()` 创建；调用 `cancel()` 后，监听该令牌的请求会被中止，
 * 并抛出 UnCanceledError。
 */
export class UnCancelToken<T = UnData, D = UnData> {
  promise: Promise<UnCancel>;
  reason?: UnCancel;

  private listeners: UnCancelTokenListener[] = [];

  constructor(executor: (cancel: UnCanceler<T, D>) => void) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }

    let resolvePromise: UnCancelTokenListener;

    this.promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    this.promise.then((cancel) => {
      for (const listener of this.listeners) {
        listener(cancel);
      }
      this.listeners = [];
    });

    // 重写 promise.then：每次 then 都挂一个新的订阅，
    // 并在返回的 promise 上额外提供 cancel() 来取消这次订阅
    // biome-ignore lint/suspicious/noThenProperty: Expected.
    this.promise.then = (onfulfilled) => {
      let _resolve: UnCancelTokenListener;
      const promise = new Promise<UnCancel>((resolve) => {
        this.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      // @ts-expect-error Property 'cancel' does not exist on type 'Promise<TResult1>'.ts(2339)
      promise.cancel = () => {
        this.unsubscribe(_resolve);
      };

      return promise;
    };

    executor((message, config, request) => {
      if (this.reason) {
        return;
      }
      this.reason = new UnCanceledError(message, config, request);
      resolvePromise(this.reason);
    });
  }

  /** 已经取消过的话直接抛出取消错误，请求发出前会调用 */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  subscribe(listener: UnCancelTokenListener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    this.listeners.push(listener);
  }

  unsubscribe(listener: UnCancelTokenListener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /** 转换为标准的 AbortSignal，方便和 config.signal 搭配使用 */
  toAbortSignal() {
    const controller = new AbortController();

    const abort: UnCancelTokenListener = (error) => {
      controller.abort(error);
    };

    this.subscribe(abort);

    // @ts-expect-error Property 'unsubscribe' does not exist on type 'AbortSignal'.ts(2339)
    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal as AbortSignal & {
      unsubscribe: () => void;
    };
  }

  /** 创建一个令牌和配套的 cancel 函数 */
  static source<TT = UnData, DD = UnData>(): UnCancelTokenSource<TT, DD> {
    let cancel: UnCanceler<TT, DD>;
    const token = new UnCancelToken<TT, DD>((c) => {
      cancel = c;
    });
    return {
      token,
      // @ts-expect-error Variable 'cancel' is used before being assigned.ts(2454)
      cancel,
    };
  }
}
