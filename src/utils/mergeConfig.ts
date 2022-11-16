import { mergeDeepRight } from 'ramda';
import { UnConfig, UnData } from '../types';

export function mergeConfig<T = UnData, D = UnData>(
  config1?: UnConfig<T, D>,
  config2?: UnConfig<T, D>,
) {
  return mergeDeepRight(config1 ?? {}, config2 ?? {}) as UnConfig<T, D>;
}
