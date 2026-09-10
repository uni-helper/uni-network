/**
 * 入口文件：创建默认实例 `un` 并把核心类、工具方法挂上去。
 * 导出的 `un` 可以直接调用，也可以用 `un.create()` 建自己的实例。
 */

import { version } from "../package.json";
import {
  HttpStatusCode,
  isUnCancel,
  isUnError,
  Un,
  UnCanceledError,
  UnCancelToken,
  type UnCancelTokenStatic,
  UnError,
} from "./core";
import { defaults } from "./defaults";
import type { UnConfig, UnData, UnResponse } from "./types";
import { extend, mergeConfig } from "./utils";

export interface UnInstance<T = UnData, D = UnData> extends Un<T, D> {
  <TT = T, DD = D, R = UnResponse<TT, DD>>(
    config: UnConfig<TT, DD>,
  ): Promise<R>;
  <TT = T, DD = D, R = UnResponse<TT, DD>>(
    url: string,
    config?: UnConfig<TT, DD>,
  ): Promise<R>;

  defaults: UnConfig<T, D>;
}

export interface UnStatic<T = UnData, D = UnData> extends UnInstance<T, D> {
  create: (config?: UnConfig<T, D>) => UnInstance<T, D>;

  Un: typeof Un;

  CanceledError: typeof UnCanceledError<T, D>;
  CancelToken: UnCancelTokenStatic<T, D>;
  isCancel: (value: any) => value is UnCanceledError<T, D>;

  VERSION: string;

  UnError: typeof UnError;
  isUnError: <T = any, D = any>(value: any) => value is UnError<T, D>;

  all: (values: Array<T | Promise<T>>) => Promise<T[]>;

  mergeConfig: typeof mergeConfig;

  HttpStatusCode: typeof HttpStatusCode;
}

/**
 * 创建一个绑定到 Un 实例上的可调用函数（既是函数又带方法），
 * 再把原型和实例上的方法拷贝过去。
 */
const createInstance = <T = UnData, D = UnData>(
  defaultConfig: UnConfig<T, D>,
) => {
  const context = new Un(defaultConfig);
  const instance = Un.prototype.request.bind(context) as UnStatic<T, D>;

  // 把 Un 原型上的方法拷到实例上，并绑定 this 到 context
  extend(instance, Un.prototype, context, { allOwnKeys: true });

  // 把实例自身的属性（defaults、interceptors 等）也拷过去
  extend(instance, context, null, { allOwnKeys: true });

  // 工厂方法：基于当前实例的配置再创建一个新实例
  instance.create = (instanceConfig) =>
    createInstance(mergeConfig(defaultConfig, instanceConfig));

  return instance;
};

// 创建默认导出的实例
const un = createInstance(defaults);

// 暴露 Un 类，方便继承扩展
un.Un = Un;

// 暴露 CanceledError & CancelToken & isCancel
un.CanceledError = UnCanceledError;
un.CancelToken = UnCancelToken;
un.isCancel = isUnCancel;

un.VERSION = version;

// 暴露 UnError & isUnError
un.UnError = UnError;
un.isUnError = isUnError;

// 暴露 Promise.all 的别名
un.all = (promises) => Promise.all(promises);

// 暴露 mergeConfig
un.mergeConfig = mergeConfig;

// 暴露 HttpStatusCode
un.HttpStatusCode = HttpStatusCode;

export * from "./adapters";
export * from "./core";
export * from "./defaults";
export * from "./types";
export * from "./utils";
export { un };
export const create = un.create;

export default un;
