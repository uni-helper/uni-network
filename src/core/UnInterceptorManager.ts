import type { UnConfig, UnData } from '../types';

export interface UnInterceptorOptions<T = UnData, D = UnData> {
  synchronous?: boolean;
  runWhen?: (config: UnConfig<T, D>) => boolean;
}

export interface UnInterceptorManagerHandlerFulfilled<V> {
  (value: V): V | Promise<V>;
}

export interface UnInterceptorManagerHandlerRejected {
  (error: any): any;
}

export interface UnInterceptorManagerHandler<V, T = V, D = UnData>
  extends UnInterceptorOptions<T, D> {
  fulfilled?: UnInterceptorManagerHandlerFulfilled<V>;
  rejected?: UnInterceptorManagerHandlerRejected;
}

export class UnInterceptorManager<V, T = V, D = UnData> {
  private handlers: (UnInterceptorManagerHandler<V, T, D> | null)[] = [];

  use(
    fulfilled: UnInterceptorManagerHandlerFulfilled<V>,
    rejected: UnInterceptorManagerHandlerRejected,
    options: UnInterceptorOptions<T, D>,
  ) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options?.synchronous ?? false,
      runWhen: options?.runWhen,
    });
    return this.handlers.length - 1;
  }

  eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  each(fn: (handler: UnInterceptorManagerHandler<V, T, D>) => any) {
    for (const handler of this.handlers) {
      if (handler && fn) {
        fn(handler);
      }
    }
  }
}
