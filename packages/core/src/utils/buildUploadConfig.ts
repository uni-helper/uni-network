import type { UnData, UnConfig } from '../types';
import { buildFullPath } from './buildFullPath';
import { buildUrl } from './buildUrl';

export const buildUploadConfig = <T = UnData, D = UnData>(
  config: UnConfig<T, D>,
) =>
  ({
    url: buildUrl(
      buildFullPath(config.baseUrl ?? '', config.url ?? ''),
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
  }) as UniApp.UploadFileOption;
