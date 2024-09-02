export const isAbsoluteUrl = (url: string) => {
  // A URL is considered absolute if it begins with "<scheme>://".
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  // eslint-disable-next-line regexp/no-unused-capturing-group
  return /^([a-z][\d+.a-z-]*:)\/\//i.test(url);
};
