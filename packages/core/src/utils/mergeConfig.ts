import merge from "lodash.merge";
import type { UnConfig, UnData } from "../types";

export function mergeConfig<T = UnData, D = UnData>(
  config1?: UnConfig<T, D>,
  config2?: UnConfig<T, D>,
) {
  return merge({}, config1 ?? {}, config2 ?? {});
}
