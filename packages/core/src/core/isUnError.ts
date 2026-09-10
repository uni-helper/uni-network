import type { UnData } from "../types";
import type { UnError } from "./UnError";

/**
 * 判断一个值是不是 UnError 实例。
 *
 * 因为小程序环境里可能存在多个类副本，instanceof 不可靠，
 * 所以用打标记的方式判断。
 */
export const isUnError = <T = UnData, D = UnData>(
  value: any,
): value is UnError<T, D> => value?.isUnError === true;
