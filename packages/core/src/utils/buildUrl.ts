import qs from "fast-querystring";
import type { UnParams, UnParamsSerializer } from "../types";

/**
 * 把 params 序列化后拼到 url 上。
 *
 * 优先用自定义的 paramsSerializer；params 是 URLSearchParams 时
 * 直接 toString；否则用 fast-querystring。
 * url 里的 hash 部分会被丢弃，查询串里已有的 ? 会用 & 继续。
 */
export const buildUrl = (
  url: string,
  params?: UnParams,
  paramsSerializer?: UnParamsSerializer,
) => {
  if (!params) {
    return url;
  }

  let newUrl = url;
  // hash 部分不需要发给服务器，先截掉
  const hashIndex = url.indexOf("#");
  if (hashIndex !== -1) {
    newUrl = newUrl.slice(0, hashIndex);
  }

  const serializerParams = paramsSerializer
    ? paramsSerializer(params)
    : Object.prototype.toString.call(params).includes("URLSearchParams")
      ? params.toString()
      : qs.stringify(params);

  if (serializerParams) {
    newUrl += (newUrl.includes("?") ? "&" : "?") + serializerParams;
  }

  return newUrl;
};
