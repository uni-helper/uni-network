import type { UnConfig, UnData } from "../types";
import { buildFullPath } from "./buildFullPath";
import { buildUrl } from "./buildUrl";

/**
 * 把 UnConfig 转成 uni.downloadFile 需要的参数。
 * 值为 null/undefined 的字段会被剔除，不传给 uni.downloadFile。
 */
export const buildDownloadConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
): UniApp.DownloadFileOption => {
  const result = {
    url: buildUrl(
      buildFullPath(
        config.baseUrl ?? "",
        config.url ?? "",
        config.allowAbsoluteUrls ?? true,
        config,
      ),
      config.params,
      config.paramsSerializer,
    ),
    header: config.headers,
    timeout: config.timeout,
    filePath: config.filePath,
  };

  // 剔除未配置的字段，避免覆盖 uni.downloadFile 内部默认值
  const entries = Object.entries(result) as [
    keyof typeof result,
    (typeof result)[keyof typeof result],
  ][];
  return Object.fromEntries(
    entries.filter(([k]) => result[k] != null),
  ) as unknown as UniApp.DownloadFileOption;
};
