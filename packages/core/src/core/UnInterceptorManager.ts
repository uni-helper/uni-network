import type { UnConfig, UnData } from "../types";

export interface UnInterceptorOptions<T = UnData, D = UnData> {
  synchronous?: boolean;
  runWhen?: ((config: UnConfig<T, D>) => boolean) | null;
}

export type UnInterceptorManagerHandlerFulfilled<V> = (
  value: V,
) => V | Promise<V>;

export type UnInterceptorManagerHandlerRejected = (error: any) => any;

export interface UnInterceptorManagerHandler<V, T = V, D = UnData>
  extends UnInterceptorOptions<T, D> {
  fulfilled?: UnInterceptorManagerHandlerFulfilled<V>;
  rejected?: UnInterceptorManagerHandlerRejected;
}

/**
 * 拦截器管理器，分别用于请求和响应。
 *
 * use() 返回一个 id，用 eject(id) 可以移除对应拦截器。
 */
export class UnInterceptorManager<V, T = V, D = UnData> {
  private handlers: (UnInterceptorManagerHandler<V, T, D> | null)[] = [];

  /** 注册拦截器，返回用于 eject 的 id */
  use(
    fulfilled?: UnInterceptorManagerHandlerFulfilled<V>,
    rejected?: UnInterceptorManagerHandlerRejected,
    options?: UnInterceptorOptions<T, D>,
  ) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options?.synchronous ?? false,
      runWhen: options?.runWhen,
    });
    return this.handlers.length - 1;
  }

  /** 移除指定 id 的拦截器 */
  eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
    // 删除末尾连续的空位，避免 eject 之后数组一直增长；
    // 中间的空位不动，保证已有的 id 顺序不变
    // https://github.com/axios/axios/pull/11087
    while (
      this.handlers.length > 0 &&
      this.handlers[this.handlers.length - 1] === null
    ) {
      this.handlers.pop();
    }
  }

  /** 移除全部拦截器 */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /** 遍历所有有效拦截器（跳过已 eject 的空位） */
  each(fn: (handler: UnInterceptorManagerHandler<V, T, D>) => any) {
    for (const handler of this.handlers) {
      if (handler && fn) {
        fn(handler);
      }
    }
  }
}
