import type { UnConfig } from '../types';

export const defaults: Partial<UnConfig> = {
  adapter: 'request',
  timeout: 0,
  validateStatus: (status) => status >= 200 && status < 300,
};
