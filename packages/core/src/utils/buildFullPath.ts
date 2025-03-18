import { combineUrls } from "./combineUrls";
import { isAbsoluteUrl } from "./isAbsoluteUrl";

export const buildFullPath = (
  baseUrl: string,
  requestedUrl: string,
  allowAbsoluteUrls: boolean,
) => {
  const isRelativeUrl = !isAbsoluteUrl(requestedUrl);
  if ((baseUrl && isRelativeUrl) || !allowAbsoluteUrls) {
    return combineUrls(baseUrl, requestedUrl);
  }
  return requestedUrl;
};
