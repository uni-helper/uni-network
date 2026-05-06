import type { UnData, UnResponse } from "../types";
import { UnError } from "./UnError";

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
