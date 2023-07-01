import statuses from 'statuses';
import { settle } from '../core/settle';
import { UnCanceledError } from '../core/UnCanceledError';
import { buildRequestConfig } from '../utils';
import { UnCancelTokenListener } from '../core/UnCancelToken';
import type { UnData, UnConfig, UnResponse } from '../types';

export const requestAdapter = <T = UnData, D = UnData>(config: UnConfig<T, D>) =>
  new Promise<UnResponse<T, D>>((resolve, reject) => {
    const { onHeadersReceived, onChunkReceived, cancelToken, signal } = config;

    const requestConfig = buildRequestConfig(config);

    let onCanceled: UnCancelTokenListener;
    const done = () => {
      cancelToken?.unsubscribe(onCanceled);
      signal?.removeEventListener?.('abort', onCanceled);
    };

    let response: UnResponse<T, D>;
    let task: UniApp.RequestTask | undefined;

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
        response = {
          ...response,
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
        if (onChunkReceived) {
          // @ts-expect-error uni-app types lost
          task?.offChunkReceived(onChunkReceived);
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
    if (onChunkReceived) {
      // @ts-expect-error uni-app types lost
      task.onChunkReceived(onChunkReceived);
    }

    if (cancelToken || signal) {
      onCanceled = (cancel) => {
        if (!task) {
          return;
        }
        // @ts-expect-error no types
        reject(!cancel || cancel.type ? new UnCanceledError(undefined, config, task) : cancel);
        task.abort();
        task = undefined;
      };

      cancelToken?.subscribe(onCanceled);
      // @ts-expect-error no types
      signal?.aborted ? onCanceled() : signal?.addEventListener('abort', onCanceled);
    }
  });
