import type { UnConfig } from "../types";

export const defaults: Partial<UnConfig> = {
  adapter: "request",
  validateStatus: (status) => status >= 200 && status < 300,
};
