import { combineUrls } from './combineUrls';
import { isAbsoluteUrl } from './isAbsoluteUrl';

export const buildFullPath = (baseUrl: string, requestedUrl: string) => {
  if (baseUrl && !isAbsoluteUrl(requestedUrl)) {
    return combineUrls(baseUrl, requestedUrl);
  }
  return requestedUrl;
};
