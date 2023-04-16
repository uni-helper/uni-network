import type { Ref, ShallowRef } from 'vue-demi';
import { ref, shallowRef } from 'vue-demi';
import { isString, until } from '@vueuse/core';
import type { UnInstance, UnResponse, UnCancelTokenSource, UnConfig, UnData } from './index';
import { un, UnError } from './index';

export interface UseUnReturn<T = UnData, R = UnResponse<T>, D = UnData> {
  /** Un 响应 */
  response: ShallowRef<R | undefined>;
  /** Un 响应数据 */
  data: Ref<T | undefined>;
  /** 是否已经结束 */
  isFinished: Ref<boolean>;
  /** 是否正在请求 */
  isLoading: Ref<boolean>;
  /** 是否已经取消 */
  isAborted: Ref<boolean>;
  /** isAborted 别名 */
  isCanceled: Ref<boolean>;
  /** 发生的错误 */
  error: ShallowRef<unknown | undefined>;
  /** 取消当前请求 */
  abort: (message?: string | undefined) => void;
  /** abort 别名 */
  cancel: (message?: string | undefined) => void;
}
export interface StrictUseUnReturn<T, R, D> extends UseUnReturn<T, R, D> {
  /** 手动调用 */
  execute: (
    url?: string | UnConfig<T, D>,
    config?: UnConfig<T, D>,
  ) => Promise<StrictUseUnReturn<T, R, D>>;
}
export interface EasyUseUnReturn<T, R, D> extends UseUnReturn<T, R, D> {
  /** 手动调用 */
  execute: (url: string, config?: UnConfig<T, D>) => Promise<EasyUseUnReturn<T, R, D>>;
}
export interface UseUnOptions<T = UnData> {
  /** 当 `useUn` 被调用时，是否自动发起请求 */
  immediate?: boolean;
  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;
  /** 发生错误时调用 */
  onError?: (e: unknown) => void;
  /** 成功请求时调用 */
  onSuccess?: (data: T) => void;
}
type OverallUseUnReturn<T, R, D> = StrictUseUnReturn<T, R, D> | EasyUseUnReturn<T, R, D>;

const isUnInstance = (val: any) => !!val?.request && !!val?.download && !!val?.upload;

export function useUn<T = UnData, R = UnResponse<T>, D = UnData>(
  url: string,
  config?: UnConfig<T, D>,
  options?: UseUnOptions<T>,
): StrictUseUnReturn<T, R, D> & Promise<StrictUseUnReturn<T, R, D>>;
export function useUn<T = any, R = UnResponse<T>, D = any>(
  url: string,
  instance?: UnInstance,
  options?: UseUnOptions<T>,
): StrictUseUnReturn<T, R, D> & Promise<StrictUseUnReturn<T, R, D>>;
export function useUn<T = any, R = UnResponse<T>, D = any>(
  url: string,
  config: UnConfig<T, D>,
  instance: UnInstance,
  options?: UseUnOptions<T>,
): StrictUseUnReturn<T, R, D> & Promise<StrictUseUnReturn<T, R, D>>;
export function useUn<T = any, R = UnResponse<T>, D = any>(
  config?: UnConfig<T, D>,
): EasyUseUnReturn<T, R, D> & Promise<EasyUseUnReturn<T, R, D>>;
export function useUn<T = any, R = UnResponse<T>, D = any>(
  instance?: UnInstance,
): EasyUseUnReturn<T, R, D> & Promise<EasyUseUnReturn<T, R, D>>;
export function useUn<T = any, R = UnResponse<T>, D = any>(
  config?: UnConfig<T, D>,
  instance?: UnInstance,
): EasyUseUnReturn<T, R, D> & Promise<EasyUseUnReturn<T, R, D>>;

export function useUn<T = any, R = UnResponse<T>, D = any>(
  ...args: any[]
): OverallUseUnReturn<T, R, D> & Promise<OverallUseUnReturn<T, R, D>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined;
  const argsPlaceholder = isString(url) ? 1 : 0;
  let defaultConfig: UnConfig<T, D> = {};
  let instance: UnInstance = un;
  let options: UseUnOptions<T> = { immediate: !!argsPlaceholder, shallow: true };

  if (args.length > 0 + argsPlaceholder) {
    /** 在这里不能使用 `instanceof`，原因请参考 https://github.com/axios/axios/issues/737 */
    if (isUnInstance(args[0 + argsPlaceholder])) instance = args[0 + argsPlaceholder];
    else defaultConfig = args[0 + argsPlaceholder];
  }

  if (args.length > 1 + argsPlaceholder && isUnInstance(args[1 + argsPlaceholder]))
    instance = args[1 + argsPlaceholder];
  if (
    (args.length === 2 + argsPlaceholder && !isUnInstance(args[1 + argsPlaceholder])) ||
    args.length === 3 + argsPlaceholder
  )
    options = args[args.length - 1];

  const response = shallowRef<UnResponse<T, D>>();
  const data = options.shallow ? shallowRef<T>() : ref<T>();
  const isFinished = ref(false);
  const isLoading = ref(false);
  const isAborted = ref(false);
  const error = shallowRef<unknown>();

  const cancelTokenSource = un.CancelToken.source;
  let cancelToken: UnCancelTokenSource = cancelTokenSource();

  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return;
    cancelToken.cancel(message);
    cancelToken = cancelTokenSource();
    isAborted.value = true;
    isLoading.value = false;
    isFinished.value = false;
  };
  const loading = (loading: boolean) => {
    isLoading.value = loading;
    isFinished.value = !loading;
  };
  const waitUntilFinished = () =>
    new Promise<OverallUseUnReturn<T, R, D>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => (error.value ? reject(error.value) : resolve(result)));
    });
  const promise = {
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<OverallUseUnReturn<T, R, D>>;
  const execute: OverallUseUnReturn<T, R, D>['execute'] = (
    executeUrl: string | UnConfig<T, D> | undefined = url,
    config: UnConfig<T, D> = {},
  ) => {
    error.value = undefined;
    const _url = typeof executeUrl === 'string' ? executeUrl : url ?? config.url;

    if (_url === undefined) {
      error.value = new UnError(UnError.ERR_INVALID_URL);
      isFinished.value = true;
      return promise;
    }
    abort();
    loading(true);
    instance(_url, {
      ...defaultConfig,
      ...(typeof executeUrl === 'object' ? executeUrl : config),
      cancelToken: cancelToken.token,
    })
      .then((r: any) => {
        response.value = r;
        const result = r.data;
        data.value = result;
        options.onSuccess?.(result);
      })
      // eslint-disable-next-line unicorn/catch-error-name
      .catch((e: any) => {
        error.value = e;
        options.onError?.(e);
      })
      .finally(() => loading(false));
    return promise;
  };
  if (options.immediate && url) (execute as StrictUseUnReturn<T, R, D>['execute'])();

  const result = {
    response,
    data,
    error,
    finished: isFinished,
    loading: isLoading,
    isFinished,
    isLoading,
    cancel: abort,
    isAborted,
    canceled: isAborted,
    aborted: isAborted,
    isCanceled: isAborted,
    abort,
    execute,
  } as OverallUseUnReturn<T, R, D>;

  return {
    ...result,
    ...promise,
  };
}
