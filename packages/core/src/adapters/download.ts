import statuses from "statuses-es";
import { settle } from "../core/settle";
import { UnCanceledError } from "../core/UnCanceledError";
import type { UnCancelTokenListener } from "../core/UnCancelToken";
import { UnError } from "../core/UnError";
import type { UnConfig, UnData, UnResponse } from "../types";
import { buildDownloadConfig } from "../utils";

export const downloadAdapter = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
) =>
  new Promise<UnResponse<T, D>>((resolve, reject) => {
    const { onHeadersReceived, cancelToken, signal } = config;

    const onProgressUpdate =
      config?.onDownloadProgress ??
      config?.onDownloadProgressUpdate ??
      config?.onProgress ??
      config?.onProgressUpdate;

    const downloadConfig = buildDownloadConfig(config);

    let onCanceled: UnCancelTokenListener;
    const done = () => {
      cancelToken?.unsubscribe(onCanceled);
      // @ts-expect-error No overload matches this call.
      signal?.removeEventListener("abort", onCanceled);
    };

    let task: UniApp.DownloadTask | undefined;

    task = uni.downloadFile({
      ...downloadConfig,
      success: (res) => {
        let statusText: string | undefined;
        try {
          statusText = statuses(res?.statusCode)?.toString();
        } catch (_) {
          // ↑ 为支付宝小程序保留 (_)
          // 当 statusCode 不合法、statuses 抛出错误时，设置 statusText 为 undefined
          statusText = undefined;
        }
        const response: UnResponse<T, D> = {
          // @ts-expect-error no types
          errMsg: res?.errMsg ?? res?.errmsg ?? res?.msg ?? res?.message,
          // @ts-expect-error no types
          errno: res?.errno,
          tempFilePath: res?.tempFilePath,
          filePath: res?.filePath,
          profile: res?.profile,
          status: res?.statusCode,
          statusText,
          // @ts-expect-error no types
          headers: res?.header ?? res?.headers,
          config,
          // @ts-expect-error no types
          data: {
            tempFilePath: res?.tempFilePath,
            filePath: res?.filePath,
          },
          task,
        };
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
      fail: (err) => {
        switch (err.errMsg) {
          case "request:fail abort":
            reject(new UnError(err.errMsg, UnError.ERR_CANCELED, config, task));
            break;
          case "request:fail timeout":
            reject(new UnError(err.errMsg, UnError.ETIMEDOUT, config, task));
            break;
          default:
            reject(new UnError(err.errMsg, UnError.ERR_NETWORK, config, task));
            break;
        }
      },
      complete: () => {
        if (onHeadersReceived) {
          task?.offHeadersReceived(onHeadersReceived);
        }
        if (onProgressUpdate) {
          task?.offProgressUpdate(onProgressUpdate);
        }
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
