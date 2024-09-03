import { downloadAdapter } from "./download";
import { requestAdapter } from "./request";
import { uploadAdapter } from "./upload";

export const adapters = {
  download: downloadAdapter,
  request: requestAdapter,
  upload: uploadAdapter,
};

export * from "./download";
export * from "./request";
export * from "./upload";
