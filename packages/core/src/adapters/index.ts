import { downloadAdapter } from "./download";
import { requestAdapter } from "./request";
import { uploadAdapter } from "./upload";

/**
 * 内置适配器，key 对应 config.adapter 可填的字符串值。
 * 默认使用 requestAdapter。
 */
export const adapters = {
  download: downloadAdapter,
  request: requestAdapter,
  upload: uploadAdapter,
};

export * from "./download";
export * from "./request";
export * from "./upload";
