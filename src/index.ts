import { version } from '../package.json';
import {
  isUnError,
  Un,
  UnCancel,
  UnCanceledError,
  UnCancelToken,
  UnCancelTokenStatic,
  UnError,
  isUnCancel,
} from './core';
import { defaults } from './defaults';
import { extend, mergeConfig } from './utils';
import { UnConfig, UnData, UnResponse } from './types';

export interface UnInstance<T = UnData, D = UnData> extends Un<T, D> {
  <TT = T, DD = D, R = UnResponse<TT, DD>>(config: UnConfig<TT, DD>): Promise<R>;
  <TT = T, DD = D, R = UnResponse<TT, DD>>(url: string, config?: UnConfig<TT, DD>): Promise<R>;

  defaults: UnConfig<T, D>;
}

export interface UnStatic<T = UnData, D = UnData> extends UnInstance<T, D> {
  create(config?: UnConfig<T, D>): UnInstance<T, D>;

  Un: typeof Un;

  CanceledError: typeof UnCanceledError<T, D>;
  CancelToken: UnCancelTokenStatic<T, D>;
  isCancel(value: any): value is UnCancel;

  VERSION: string;

  UnError: typeof UnError;
  isUnError<T = any, D = any>(value: any): value is UnError<T, D>;

  all(values: Array<T | Promise<T>>): Promise<T[]>;
}

const createInstance = <T = UnData, D = UnData>(defaultConfig: UnConfig<T, D>) => {
  const context = new Un(defaultConfig);
  const instance = Un.prototype.request.bind(context) as UnStatic<T, D>;

  // Copy ur.prototype to instance
  extend(instance, Un.prototype, context, { allOwnKeys: true });

  // Copy context to instance
  extend(instance, context, null, { allOwnKeys: true });

  // Factory for creating new instances
  instance.create = (instanceConfig) => createInstance(mergeConfig(defaultConfig, instanceConfig));

  return instance;
};

// Create the default instance to be exported
const un = createInstance(defaults);

// Expose Un class to allow class inheritance
un.Un = Un;

// Expose CanceledError & CancelToken & isCancel
un.CanceledError = UnCanceledError;
un.CancelToken = UnCancelToken;
un.isCancel = isUnCancel;

// version
un.VERSION = version;

// Expose UnError & isUnError
un.UnError = UnError;
un.isUnError = isUnError;

// Expose all/spread
un.all = (promises) => Promise.all(promises);

export * from './adapters';
export * from './core';
export * from './defaults';
export * from './utils';
export * from './types';
export { un };

export default un;
