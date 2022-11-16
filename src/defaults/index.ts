import { HttpStatusCode, UnConfig } from '../types';

export const defaults: Partial<UnConfig> = {
  adapter: 'request',
  timeout: 0,
  validateStatus: (status) =>
    status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices,
};
