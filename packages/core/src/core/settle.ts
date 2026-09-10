import type { UnData, UnResponse } from "../types";
import { UnError } from "./UnError";

/**
 * 根据响应和配置里的 validateStatus 决定 resolve 还是 reject。
 * 4xx 抛 ERR_BAD_REQUEST，其它抛 ERR_BAD_RESPONSE。
 */
export const settle = <
  T = UnData,
  D = UnData,
  R extends UnResponse<T, D> = UnResponse<T, D>,
>(
  resolve: (value: R | PromiseLike<R>) => void,
  reject: (reason?: any) => void,
  response: R,
) => {
  const validateStatus = response?.config?.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      new UnError(
        `Request failed with status code ${response.status}`,
        response.status >= 400 && response.status < 500
          ? UnError.ERR_BAD_REQUEST
          : UnError.ERR_BAD_RESPONSE,
        response.config,
        response.task,
        response,
      ),
    );
  }
};
