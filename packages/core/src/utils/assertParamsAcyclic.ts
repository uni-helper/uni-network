import { UnError } from "../core/UnError";
import type { UnParams } from "../types";

const isPlainObject = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";

/**
 * 检查 params 里有没有循环引用，有就抛 ERR_BAD_OPTION_VALUE。
 *
 * 序列化器遇到循环嵌套会静默丢参数（fast-querystring 直接输出空值），
 * 拼出来的 URL 看似正常却少了东西，排查成本很高，所以提前报错。
 *
 * 仅在本库内部使用，不从 utils/index 导出。
 */
export const assertParamsAcyclic = (params?: UnParams) => {
  const pending: { value: any; done?: boolean }[] = [{ value: params }];
  const active = new WeakSet<object>();
  const visited = new WeakSet<object>();

  while (pending.length > 0) {
    const entry = pending.pop();
    if (!entry) {
      continue;
    }

    const { value, done } = entry;

    // 只关心普通对象和数组，其它类型（含 URLSearchParams）交给序列化器
    if (!isPlainObject(value) && !Array.isArray(value)) {
      continue;
    }

    if (done) {
      active.delete(value);
      continue;
    }

    if (active.has(value)) {
      throw new UnError(
        "Circular reference detected in params",
        UnError.ERR_BAD_OPTION_VALUE,
      );
    }

    if (visited.has(value)) {
      continue;
    }

    visited.add(value);
    active.add(value);
    pending.push({ value, done: true });

    for (const key of Object.keys(value)) {
      pending.push({ value: value[key] });
    }
  }
};
