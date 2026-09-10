/**
 * 判断 url 是否是绝对地址（以 "协议://" 开头，如 https://example.com）。
 * 协议名的规则来自 RFC 3986。
 */
export const isAbsoluteUrl = (url: string) => {
  // A URL is considered absolute if it begins with "<scheme>://".
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  // eslint-disable-next-line regexp/no-unused-capturing-group
  if (typeof url !== "string") {
    return false;
  }

  return /^([a-z][\d+.a-z-]*:)\/\//i.test(url);
};
