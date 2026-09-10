import statuses from "statuses-es";
import { settle } from "../core/settle";
import { UnCanceledError } from "../core/UnCanceledError";
import type { UnCancelTokenListener } from "../core/UnCancelToken";
import { UnError } from "../core/UnError";
import type { UnConfig, UnData, UnResponse } from "../types";
import { buildRequestConfig } from "../utils";

/**
 * 普通请求适配器，封装 uni.request。
 *
 * 负责把 UnConfig 转成 uni.request 参数、注册取消监听和
 * headers/chunk 事件回调，最后用 settle 决定 resolve 还是 reject。
 * statusText 通过 statuses-es 由状态码反查，各平台字段名不一致
 * （errMsg/errmsg、header/headers）都做了兼容。
 */
export const requestAdapter = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
) =>
  new Promise<UnResponse<T, D>>((resolve, reject) => {
    const { onHeadersReceived, onChunkReceived, cancelToken, signal } = config;

    const requestConfig = buildRequestConfig(config);

    let onCanceled: UnCancelTokenListener;
    // 请求结束后反注册取消监听，避免泄漏
    const done = () => {
      cancelToken?.unsubscribe(onCanceled);
      signal?.removeEventListener?.("abort", onCanceled);
    };

    let task: UniApp.RequestTask | undefined;

    // 发请求。注意 task 是同步赋值的，取消回调里能立刻拿到并 abort
    task = uni.request({
      ...requestConfig,
      success: (res) => {
        let statusText: string | undefined;
        try {
          statusText = statuses(res?.statusCode)?.toString();
        } catch (_) {
          /// ↑ 为支付宝小程序保留 (_)
          // 当 statusCode 不合法、statuses 抛出错误时，设置 statusText 为 undefined
          statusText = undefined;
        }
        const response: UnResponse<T, D> = {
          // @ts-expect-error no types
          errMsg: res?.errMsg ?? res?.errmsg ?? res?.msg ?? res?.message,
          // @ts-expect-error no types
          errno: res?.errno,
          cookies: res?.cookies,
          profile: res?.profile,
          status: res?.statusCode,
          statusText,
          // @ts-expect-error no types
          headers: res?.header ?? res?.headers,
          config,
          // @ts-expect-error no types
          data: res?.data,
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
        done();
      },
      complete: () => {
        if (onHeadersReceived) {
          task?.offHeadersReceived(onHeadersReceived);
        }
        if (onChunkReceived) {
          // @ts-expect-error uni-app types lost
          task?.offChunkReceived(onChunkReceived);
        }
      },
    });

    if (onHeadersReceived) {
      task.onHeadersReceived(onHeadersReceived);
    }
    if (onChunkReceived) {
      // @ts-expect-error uni-app types lost
      task.onChunkReceived(onChunkReceived);
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
        done();
        task = undefined;
      };

      cancelToken?.subscribe(onCanceled);
      signal?.aborted
        ? onCanceled({})
        : signal?.addEventListener?.("abort", onCanceled);
    }
  });
