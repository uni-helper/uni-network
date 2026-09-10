import merge from "lodash.merge";
import type { UnConfig, UnData } from "../types";

// lodash.merge 会丢掉用 symbol 作键的配置项，这里手动补上
// https://github.com/axios/axios/pull/11043
const copySymbols = (target: any, ...sources: any[]) => {
  for (const source of sources) {
    if (source == null || typeof source !== "object") {
      continue;
    }
    for (const key of Object.getOwnPropertySymbols(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export function mergeConfig<T = UnData, D = UnData>(
  config1?: UnConfig<T, D>,
  config2?: UnConfig<T, D>,
) {
  const merged = merge({}, config1 ?? {}, config2 ?? {});
  return copySymbols(merged, config1, config2);
}
