import type { UnConfig, UnData } from "../types";
import { buildFullPath } from "./buildFullPath";
import { buildUrl } from "./buildUrl";

export const buildRequestConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
): UniApp.RequestOptions => {
  const result = {
    url: buildUrl(
      buildFullPath(
        config.baseUrl ?? "",
        config.url ?? "",
        config.allowAbsoluteUrls ?? true,
      ),
      config.params,
      config.paramsSerializer,
    ),
    data: config.data,
    header: config.headers,
    method: config.method?.toUpperCase() ?? "GET",
    timeout: config.timeout,
    dataType: config.dataType,
    responseType: config.responseType,
    sslVerify: config.sslVerify,
    withCredentials: config.withCredentials,
    firstIpv4: config.firstIpv4,
    enableHttp2: config.enableHttp2,
    enableQuic: config.enableQuic,
    enableCache: config.enableCache,
    enableHttpDNS: config.enableHttpDNS,
    httpDNSServiceId: config.httpDNSServiceId,
    enableChunked: config.enableChunked,
    forceCellularNetwork: config.forceCellularNetwork,
    enableCookie: config.enableCookie,
    cloudCache: config.cloudCache,
    defer: config.defer,
  };

  const entries = Object.entries(result) as [
    keyof typeof result,
    (typeof result)[keyof typeof result],
  ][];
  return Object.fromEntries(
    entries.filter(([k]) => result[k] != null),
  ) as unknown as UniApp.RequestOptions;
};
