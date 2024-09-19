import statuses from "statuses-es";
import type { UnCancelTokenListener } from "../core/UnCancelToken";
import { UnCanceledError } from "../core/UnCanceledError";
import { settle } from "../core/settle";
import type { UnConfig, UnData, UnResponse } from "../types";
import { buildUploadConfig } from "../utils";

export const uploadAdapter = <T = UnData, D = UnData>(config: UnConfig<T, D>) =>
  new Promise<UnResponse<T, D>>((resolve, reject) => {
    const { onHeadersReceived, cancelToken, signal } = config;

    const onProgressUpdate =
      config?.onUploadProgress ??
      config?.onUploadProgressUpdate ??
      config?.onProgress ??
      config?.onProgressUpdate;

    const uploadConfig = buildUploadConfig(config);

    let onCanceled: UnCancelTokenListener;
    const done = () => {
      cancelToken?.unsubscribe(onCanceled);
      // @ts-expect-error No overload matches this call.
      signal?.removeEventListener("abort", onCanceled);
    };

    let response: UnResponse<T, D>;
    let task: UniApp.UploadTask | undefined;

    task = uni.uploadFile({
      ...uploadConfig,
      success: (res) => {
        let statusText: string | undefined;
        try {
          statusText = statuses(res?.statusCode)?.toString();
        } catch (_) {
          // ↑ 为支付宝小程序保留 (_)
          // 当 statusCode 不合法、statuses 抛出错误时，设置 statusText 为 undefined
          statusText = undefined;
        }
        response = {
          ...response,
          // @ts-expect-error no types
          errMsg: res?.errMsg ?? res?.errmsg ?? res?.msg ?? res?.message,
          // @ts-expect-error no types
          errno: res?.errno,
          status: res?.statusCode,
          statusText,
          // @ts-expect-error no types
          headers: res?.header ?? res?.headers,
          config,
          // @ts-expect-error no types
          data: res?.data,
          task,
        };
      },
      fail: (err) => {
        response = {
          ...response,
          // @ts-expect-error no types
          errMsg: err?.errMsg ?? err?.errmsg ?? err?.msg ?? err?.message,
          // @ts-expect-error no types
          errno: err?.errno,
        };
      },
      complete: () => {
        if (onHeadersReceived) {
          task?.offHeadersReceived(onHeadersReceived);
        }
        if (onProgressUpdate) {
          task?.offProgressUpdate(onProgressUpdate);
        }
        settle<T, D, UnResponse<T, D>>(
          (val) => {
            resolve(val);
            done();
          },
          (err) => {
            reject(err);
            done();
          },
          response,
        );
      },
    });

    if (onHeadersReceived) {
      task.onHeadersReceived(onHeadersReceived);
    }
    if (onProgressUpdate) {
      task.onProgressUpdate(onProgressUpdate);
    }

    if (cancelToken || signal) {
      onCanceled = (cancel) => {
        if (!task) {
          return;
        }
        reject(
          // @ts-expect-error type not existed
          !cancel || cancel.type
            ? new UnCanceledError(undefined, config, task)
            : cancel,
        );
        task.abort();
        task = undefined;
      };

      cancelToken?.subscribe(onCanceled);
      signal?.aborted
        ? onCanceled({})
        : signal?.addEventListener?.("abort", onCanceled);
    }
  });
