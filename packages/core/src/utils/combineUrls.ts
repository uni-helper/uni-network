// axios#11038：把 baseURL 尾部所有斜杠都去掉，再拼一个，
// 避免 "https://a.com//" + "/x" 拼出重复斜杠
/**
 * 拼接 baseUrl 和相对地址，尾部和头部的多余斜杠都只保留一个。
 * baseUrl 为空时直接返回 relativeUrl。
 */
export const combineUrls = (baseUrl: string, relativeUrl: string) => {
  if (!relativeUrl) {
    return baseUrl;
  }
  let end = baseUrl.length;
  while (end > 0 && baseUrl.charCodeAt(end - 1) === 47) {
    end--;
  }
  return `${baseUrl.slice(0, end)}/${relativeUrl.replace(/^\/+/, "")}`;
};
