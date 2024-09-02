import { UnCancel } from './UnCancelToken';

export const isUnCancel = (value: any): value is UnCancel =>
  value?.isUnCanceledError === true;
