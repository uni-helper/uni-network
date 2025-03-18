import type { UnConfig, UnData } from "../types";
import { buildFullPath } from "./buildFullPath";
import { buildUrl } from "./buildUrl";

export const buildDownloadConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
) =>
  ({
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
  }) as UniApp.DownloadFileOption;
