import type { UnData } from "../types";
import type { UnCanceledError } from "./UnCanceledError";

/** 判断一个值是不是取消请求时抛出的 UnCanceledError */
export const isUnCancel = <T = UnData, D = UnData>(
  value: any,
): value is UnCanceledError<T, D> => value?.isUnCanceledError === true;
