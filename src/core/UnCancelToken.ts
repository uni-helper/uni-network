import { UnCanceledError } from './UnCanceledError';
import type { UnConfig, UnData, UnTask } from '../types';

export interface UnCancel {
  message?: string;
}

export interface UnCancelStatic {
  new (message?: string): UnCancel;
}

export interface UnCanceler<T = UnData, D = UnData> {
  (message?: string, config?: UnConfig<T, D>, task?: UnTask): void;
}

export interface UnCancelTokenListener {
  (reason: UnCancel | PromiseLike<UnCancel>): void;
}

export interface UnCancelToken {
  promise: Promise<UnCancel>;
  reason?: UnCancel;
  throwIfRequested(): void;
}

export interface UnCancelTokenSource<T = UnData, D = UnData> {
  token: UnCancelToken;
  cancel: UnCanceler<T, D>;
}

export interface UnCancelTokenStatic<T = UnData, D = UnData> {
  new (executor: (cancel: UnCanceler) => void): UnCancelToken;
  source(): UnCancelTokenSource<T, D>;
}

export class UnCancelToken<T = UnData, D = UnData> {
  listeners: UnCancelTokenListener[] = [];

  constructor(executor: (cancel: UnCanceler<T, D>) => void) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise: UnCancelTokenListener;

    this.promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    this.promise.then((cancel) => {
      this.listeners.forEach((listener) => {
        listener(cancel);
      });
      this.listeners = [];
    });

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
