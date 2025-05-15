import { noop, until } from "@vueuse/core";
import type { Ref, ShallowRef } from "vue-demi";
import { ref, shallowRef } from "vue-demi";
import type {
  UnCancelTokenSource,
  UnConfig,
  UnData,
  UnInstance,
  UnResponse,
} from "./index";
import { UnError, un } from "./index";

/** Align with v12.3.0 */

export interface UseUnReturn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptions<T> = UseUnOptions<T>,
> {
  /** Un 响应 */
  response: ShallowRef<R | undefined>;
  /** Un 响应数据 */
  data: O extends UseUnOptionsWithInitialData<T> ? Ref<T> : Ref<T | undefined>;
  /** 是否已经结束 */
  isFinished: Ref<boolean>;
  /** 是否正在请求 */
  isLoading: Ref<boolean>;
  /** 是否已经取消 */
  isAborted: Ref<boolean>;
  /** `isAborted` 别名 */
  isCanceled: Ref<boolean>;
  /** 发生的错误 */
  error: ShallowRef<unknown | undefined>;
  /** 取消当前请求 */
  abort: (message?: string | undefined) => void;
  /** `abort` 别名 */
  cancel: (message?: string | undefined) => void;
}
export interface StrictUseUnReturn<
  T,
  R,
  D,
  O extends UseUnOptions<T> = UseUnOptions<T>,
> extends UseUnReturn<T, R, D, O> {
  /** 手动调用 */
  execute: (
    url?: string | UnConfig<T, D>,
    config?: UnConfig<T, D>,
  ) => Promise<StrictUseUnReturn<T, R, D, O>>;
}
export interface EasyUseUnReturn<T, R, D> extends UseUnReturn<T, R, D> {
  /** 手动调用 */
  execute: (
    url: string,
    config?: UnConfig<T, D>,
  ) => Promise<EasyUseUnReturn<T, R, D>>;
}
export interface UseUnOptionsBase<T = UnData> {
  /** 当 `useUn` 被调用时，是否自动发起请求 */
  immediate?: boolean;
  /**
   * 是否使用 shallowRef
   *
   * @default true
   */
  shallow?: boolean;
  /**
   * 是否在新请求发起时中止之前的请求
   *
   * @default true
   */
  abortPrevious?: boolean;
  /**
   * 是否在执行前将请求数据重置为 initialData
   *
   * @default false
   */
  resetOnExecute?: boolean;
  /** 发生错误时调用 */
  onError?: (e: unknown) => void;
  /** 成功请求时调用 */
  onSuccess?: (data: T) => void;
  /** 请求结束时调用 */
  onFinish?: () => void;
}
export interface UseUnOptionsWithInitialData<T> extends UseUnOptionsBase<T> {
  /** 在请求还未响应时使用的响应数据 */
  initialData: T;
}
export type UseUnOptions<T = UnData> =
  | UseUnOptionsBase<T>
  | UseUnOptionsWithInitialData<T>;
type OverallUseUnReturn<T, R, D> =
  | StrictUseUnReturn<T, R, D>
  | EasyUseUnReturn<T, R, D>;

const isUnInstance = (val: any) =>
  !!val?.request && !!val?.download && !!val?.upload;

export function useUn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptionsWithInitialData<T> = UseUnOptionsWithInitialData<T>,
>(
  url: string,
  config?: UnConfig<T, D>,
  options?: O,
): StrictUseUnReturn<T, R, D, O> & Promise<StrictUseUnReturn<T, R, D, O>>;
export function useUn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptionsWithInitialData<T> = UseUnOptionsWithInitialData<T>,
>(
  url: string,
  instance?: UnInstance,
  options?: O,
): StrictUseUnReturn<T, R, D, O> & Promise<StrictUseUnReturn<T, R, D, O>>;
export function useUn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptionsWithInitialData<T> = UseUnOptionsWithInitialData<T>,
>(
  url: string,
  config: UnConfig<T, D>,
  instance: UnInstance,
  options?: O,
): StrictUseUnReturn<T, R, D, O> & Promise<StrictUseUnReturn<T, R, D, O>>;
export function useUn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptionsBase<T> = UseUnOptionsBase<T>,
>(
  url: string,
  config?: UnConfig<T, D>,
  options?: O,
): StrictUseUnReturn<T, R, D, O> & Promise<StrictUseUnReturn<T, R, D, O>>;
export function useUn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptionsBase<T> = UseUnOptionsBase<T>,
>(
  url: string,
  instance?: UnInstance,
  options?: O,
): StrictUseUnReturn<T, R, D, O> & Promise<StrictUseUnReturn<T, R, D, O>>;
export function useUn<
  T = UnData,
  R = UnResponse<T>,
  D = UnData,
  O extends UseUnOptionsBase<T> = UseUnOptionsBase<T>,
>(
  url: string,
  config: UnConfig<T, D>,
  instance: UnInstance,
  options?: O,
): StrictUseUnReturn<T, R, D, O> & Promise<StrictUseUnReturn<T, R, D, O>>;
export function useUn<T = UnData, R = UnResponse<T>, D = UnData>(
  config?: UnConfig<T, D>,
): EasyUseUnReturn<T, R, D> & Promise<EasyUseUnReturn<T, R, D>>;
export function useUn<T = UnData, R = UnResponse<T>, D = UnData>(
  instance?: UnInstance,
): EasyUseUnReturn<T, R, D> & Promise<EasyUseUnReturn<T, R, D>>;
export function useUn<T = UnData, R = UnResponse<T>, D = UnData>(
  config?: UnConfig<T, D>,
  instance?: UnInstance,
): EasyUseUnReturn<T, R, D> & Promise<EasyUseUnReturn<T, R, D>>;

export function useUn<T = UnData, R = UnResponse<T>, D = UnData>(
  ...args: any[]
): OverallUseUnReturn<T, R, D> & Promise<OverallUseUnReturn<T, R, D>> {
  const url: string | undefined =
    typeof args[0] === "string" ? args[0] : undefined;
  const argsPlaceholder = typeof url === "string" ? 1 : 0;
  let defaultConfig: UnConfig<T, D> = {};
  let instance: UnInstance = un;
  let options: UseUnOptions<T> = {
    immediate: !!argsPlaceholder,
    shallow: true,
    abortPrevious: true,
  };

  if (args.length > 0 + argsPlaceholder) {
    /** 在这里不能使用 `instanceof`，原因请参考 https://github.com/axios/axios/issues/737 */
    if (isUnInstance(args[0 + argsPlaceholder]))
      instance = args[0 + argsPlaceholder];
    else defaultConfig = args[0 + argsPlaceholder];
  }

  if (
    args.length > 1 + argsPlaceholder &&
    isUnInstance(args[1 + argsPlaceholder])
  )
    instance = args[1 + argsPlaceholder];
  if (
    (args.length === 2 + argsPlaceholder &&
      !isUnInstance(args[1 + argsPlaceholder])) ||
    args.length === 3 + argsPlaceholder
  )
    options = args.at(-1) || options;

  const {
    shallow,
    onSuccess = noop,
    onError = noop,
    immediate,
    resetOnExecute = false,
  } = options;

  const initialData = (options as UseUnOptionsWithInitialData<T>).initialData;
  const response = shallowRef<UnResponse<T, D>>();
  const data = (shallow ? shallowRef : ref)(initialData) as Ref<T | undefined>;
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

  /** 重置 data 为 initialData */
  const resetData = () => {
    if (resetOnExecute) data.value = initialData;
  };
  const waitUntilFinished = () =>
    new Promise<OverallUseUnReturn<T, R, D>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .then(() => (error.value ? reject(error.value) : resolve(result)));
    });
  const promise = {
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<OverallUseUnReturn<T, R, D>>;

  let executeCounter = 0;
  const execute: OverallUseUnReturn<T, R, D>["execute"] = (
    executeUrl: string | UnConfig<T, D> | undefined = url,
    config: UnConfig<T, D> = {},
  ) => {
    error.value = undefined;
    const _url =
      typeof executeUrl === "string" ? executeUrl : (url ?? config.url);

    if (_url === undefined) {
      error.value = new UnError(UnError.ERR_INVALID_URL);
      isFinished.value = true;
      return promise;
    }
    resetData();

    if (options.abortPrevious) abort();

    loading(true);

    executeCounter += 1;
    const currentExecuteCounter = executeCounter;
    isAborted.value = false;

    instance(_url, {
      ...defaultConfig,
      ...(typeof executeUrl === "object" ? executeUrl : config),
      cancelToken: cancelToken.token,
    })
      .then((r: any) => {
        if (isAborted.value) return;
        response.value = r;
        const result = r.data;
        data.value = result;
        onSuccess(result);
      })
      .catch((error_: any) => {
        error.value = error_;
        onError(error_);
      })
      .finally(() => {
        options.onFinish?.();
        if (currentExecuteCounter === executeCounter) loading(false);
      });
    return promise;
  };

  if (immediate && url) (execute as StrictUseUnReturn<T, R, D>["execute"])();

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
