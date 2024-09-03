import qs from "fast-querystring";
import type { UnParams, UnParamsSerializer } from "../types";

export const buildUrl = (
  url: string,
  params?: UnParams,
  paramsSerializer?: UnParamsSerializer,
) => {
  if (!params) {
    return url;
  }

  let newUrl = url;
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
