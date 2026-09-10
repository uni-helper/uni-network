import type { UnConfig } from "../types";

/**
 * 内置默认配置：默认走普通请求适配器，
 * 2xx 状态码视为成功。
 */
export const defaults: Partial<UnConfig> = {
  adapter: "request",
  validateStatus: (status) => status >= 200 && status < 300,
};
