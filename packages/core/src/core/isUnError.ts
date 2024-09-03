import type { UnData } from "../types";
import type { UnError } from "./UnError";

export const isUnError = <T = UnData, D = UnData>(
  value: any,
): value is UnError<T, D> => value?.isUnError === true;
