import type { UnConfig, UnData } from "../types";
import { buildFullPath } from "./buildFullPath";
import { buildUrl } from "./buildUrl";

/**
 * 把 UnConfig 转成 uni.uploadFile 需要的参数。
 * 值为 null/undefined 的字段会被剔除，不传给 uni.uploadFile。
 */
export const buildUploadConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
): UniApp.UploadFileOption => {
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
    files: config.files,
    fileType: config.fileType,
    file: config.file,
    filePath: config.filePath,
    name: config.name,
    header: config.headers,
    timeout: config.timeout,
    formData: config.formData,
  };

  // 剔除未配置的字段，避免覆盖 uni.uploadFile 内部默认值
  const entries = Object.entries(result) as [
    keyof typeof result,
    (typeof result)[keyof typeof result],
  ][];
  return Object.fromEntries(
    entries.filter(([k]) => result[k] != null),
  ) as unknown as UniApp.UploadFileOption;
};
