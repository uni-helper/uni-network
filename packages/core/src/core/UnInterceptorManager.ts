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
 *
 * id 由自增计数器分配，不会复用：eject 会裁剪末尾空位来避免数组一直增长，
 * 如果 id 还按数组下标算，裁剪之后新注册的拦截器会拿到一个已经被发出去的
 * id，长期持有旧 id 的代码就会误删新拦截器。
 * https://github.com/axios/axios/pull/11139
 */

// 不用 TS 的调用方可能把 id 存成 "0" 这种字符串再传回来，规范数字字符串按数字处理
const normalizeHandlerId = (id: number | string) => {
  if (typeof id === "string" && id !== "" && String(Number(id)) === id) {
    return Number(id);
  }
  return id;
};
export class UnInterceptorManager<V, T = V, D = UnData> {
  private handlers: (
    | (UnInterceptorManagerHandler<V, T, D> & { id: number })
    | null
  )[] = [];
  private nextId = 0;

  /** 注册拦截器，返回用于 eject 的 id */
  use(
    fulfilled?: UnInterceptorManagerHandlerFulfilled<V>,
    rejected?: UnInterceptorManagerHandlerRejected,
    options?: UnInterceptorOptions<T, D>,
  ) {
    const id = this.nextId;
    this.nextId += 1;
    this.handlers.push({
      id,
      fulfilled,
      rejected,
      synchronous: options?.synchronous ?? false,
      runWhen: options?.runWhen,
    });
    return id;
  }

  /** 移除指定 id 的拦截器 */
  eject(id: number) {
    const handlerId = normalizeHandlerId(id);
    const index = this.handlers.findIndex(
      (handler) => handler?.id === handlerId,
    );
    if (index !== -1) {
      this.handlers[index] = null;
    }
    // 删除末尾连续的空位，避免 eject 之后数组一直增长；
    // 中间的空位不动，保证已有拦截器的执行顺序不变
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
    this.handlers = [];
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
