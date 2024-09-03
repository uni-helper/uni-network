/**
 * 遍历数组或对象，为每项调用方法
 *
 * 如果 obj 是一个数组，传递每项的值、索引和完整的数组
 *
 * 如果 obj 是一个对象，为每个属性传递值、键和完整的对象
 */
export function forEach(
  obj: Record<string, any> | Array<any> | undefined,
  fn: (...rest: any) => any,
  { allOwnKeys = false } = {},
) {
  if (obj === null || obj === undefined) return;

  let i: number;
  let l: number;

  // Force an array if not already something iterable
  const object = typeof obj !== "object" ? [obj] : obj;

  if (Array.isArray(object)) {
    // Iterate over array values
    for (i = 0, l = object.length; i < l; i++) {
      fn.call(null, object[i], i, object);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys
      ? Object.getOwnPropertyNames(object).filter(
          (key) => key !== "constructor" && !key.startsWith("_"),
        )
      : Object.keys(object);
    const len = keys.length;
    let key: string;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, object[key], key, object);
    }
  }
}
