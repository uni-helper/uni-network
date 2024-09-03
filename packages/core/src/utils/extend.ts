import { forEach } from "./forEach";

/**
 * 向对象 a 添加对象 b 的属性
 *
 * 直接改变对象 a
 */
export const extend = (
  a: Record<string, any>,
  b: Record<string, any>,
  thisArg?: Record<string, any> | null | undefined,
  { allOwnKeys = false } = {},
) => {
  forEach(
    b,
    (val, key) => {
      a[key] = thisArg && typeof val === "function" ? val.bind(thisArg) : val;
    },
    { allOwnKeys },
  );
  return a;
};
