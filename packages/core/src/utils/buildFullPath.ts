import { UnError } from "../core/UnError";
import type { UnConfig, UnData } from "../types";
import { combineUrls } from "./combineUrls";
import { isAbsoluteUrl } from "./isAbsoluteUrl";

// 协议后面没跟 // 的情况，如 "http:foo"，视为非法 URL
const malformedHttpProtocol = /^https?:(?!\/\/)/i;
// URL 里的控制字符（制表符、换行等）可能导致协议检查被绕过，先去掉再校验
const httpProtocolControlCharacters = /[\t\n\r]/g;

/** 去掉开头的控制字符和空格（ASCII <= 0x20） */
function stripLeadingC0ControlOrSpace(url: string) {
  let i = 0;
  while (i < url.length && url.charCodeAt(i) <= 0x20) {
    i++;
  }
  return url.slice(i);
}

/** 返回用于协议校验的规整后的 URL */
function normalizeURLForProtocolCheck(url: string) {
  return stripLeadingC0ControlOrSpace(url).replace(
    httpProtocolControlCharacters,
    "",
  );
}

/** 校验 URL 不是 "http:xxx" 这种缺 // 的畸形协议写法，非法则抛 UnError */
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

/**
 * 拼出完整请求地址：baseUrl + requestedUrl。
 *
 * requestedUrl 是绝对地址时，只有 allowAbsoluteUrls 为 true 才直接使用，
 * 否则仍然会被 baseUrl 前置。
 */
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
