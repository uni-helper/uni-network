export const isAbsoluteUrl = (url: string) => {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  return /^([a-z][\d+.a-z-]*:)?\/\//i.test(url);
};
