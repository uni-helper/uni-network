export const combineUrls = (baseUrl: string, relativeUrl: string) => {
  return relativeUrl
    ? `${baseUrl.replace(/\/?\/$/, "")}/${relativeUrl.replace(/^\/+/, "")}`
    : baseUrl;
};
