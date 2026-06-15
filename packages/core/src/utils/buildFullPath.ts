import { UnError } from "../core/UnError";
import type { UnConfig, UnData } from "../types";
import { combineUrls } from "./combineUrls";
import { isAbsoluteUrl } from "./isAbsoluteUrl";

const malformedHttpProtocol = /^https?:(?!\/\/)/i;
const httpProtocolControlCharacters = /[\t\n\r]/g;

function stripLeadingC0ControlOrSpace(url: string) {
  let i = 0;
  while (i < url.length && url.charCodeAt(i) <= 0x20) {
    i++;
  }
  return url.slice(i);
}

function normalizeURLForProtocolCheck(url: string) {
  return stripLeadingC0ControlOrSpace(url).replace(
    httpProtocolControlCharacters,
    "",
  );
}

function assertValidHttpProtocolURL<T = UnData, D = UnData>(
  url: string,
  config: UnConfig<T, D>,
) {
  if (
    typeof url === "string" &&
    malformedHttpProtocol.test(normalizeURLForProtocolCheck(url))
  ) {
    throw new UnError(
      'Invalid URL: missing "//" after protocol',
      UnError.ERR_INVALID_URL,
      config,
    );
  }
}

export const buildFullPath = <T = UnData, D = UnData>(
  baseUrl: string,
  requestedUrl: string,
  allowAbsoluteUrls: boolean,
  config: UnConfig<T, D>,
) => {
  assertValidHttpProtocolURL(requestedUrl, config);
  const isRelativeUrl = !isAbsoluteUrl(requestedUrl);
  if (baseUrl && (isRelativeUrl || !allowAbsoluteUrls)) {
    assertValidHttpProtocolURL(baseUrl, config);
    return combineUrls(baseUrl, requestedUrl);
  }
  return requestedUrl;
};
