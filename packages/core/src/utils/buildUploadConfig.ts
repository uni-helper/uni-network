import type { UnConfig, UnData } from "../types";
import { buildFullPath } from "./buildFullPath";
import { buildUrl } from "./buildUrl";

export const buildUploadConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
): UniApp.UploadFileOption => {
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
    files: config.files,
    fileType: config.fileType,
    file: config.file,
    filePath: config.filePath,
    name: config.name,
    header: config.headers,
    timeout: config.timeout,
    formData: config.formData,
  };

  const entries = Object.entries(result) as [
    keyof typeof result,
    (typeof result)[keyof typeof result],
  ][];
  return Object.fromEntries(
    entries.filter(([k]) => result[k] != null),
  ) as unknown as UniApp.UploadFileOption;
};
