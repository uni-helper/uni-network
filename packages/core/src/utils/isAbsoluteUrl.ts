/**
 * 判断 url 是否是绝对地址（以 "协议://" 开头，如 https://example.com）。
 * 协议名的规则来自 RFC 3986。
 */
export const isAbsoluteUrl = (url: string) => {
  if (typeof url !== "string") {
    return false;
  }

  // 绝对 URL 以 "<scheme>://" 开头。RFC 3986 规定 scheme 以字母开头，
  // 后面可以跟字母、数字、加号、点或连字符。
  return /^([a-z][\d+.a-z-]*:)\/\//i.test(url);
};
