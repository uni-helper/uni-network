import type { UnConfig, UnData } from "../types";
import { buildFullPath } from "./buildFullPath";
import { buildUrl } from "./buildUrl";

export const buildDownloadConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
): UniApp.DownloadFileOption => {
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
    header: config.headers,
    timeout: config.timeout,
    filePath: config.filePath,
  };

  const entries = Object.entries(result) as [
    keyof typeof result,
    (typeof result)[keyof typeof result],
  ][];
  return Object.fromEntries(
    entries.filter(([k]) => result[k] != null),
  ) as unknown as UniApp.DownloadFileOption;
};
