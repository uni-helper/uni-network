import type { UnData } from "../types";
import type { UnCanceledError } from "./UnCanceledError";

export const isUnCancel = <T = UnData, D = UnData>(
  value: any,
): value is UnCanceledError<T, D> => value?.isUnCanceledError === true;
