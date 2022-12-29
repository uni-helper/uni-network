import { UnError } from './UnError';
import type { UnData } from '../types';

export const isUnError = <T = UnData, D = UnData>(value: any): value is UnError<T, D> =>
  value?.isUnError === true;
