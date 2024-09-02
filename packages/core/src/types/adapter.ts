import type { UnData } from './common';
import type { UnConfig } from './config';
import type { UnPromise } from './promise';

export interface UnAdapter<T = UnData, D = UnData> {
  (config: UnConfig<T, D>): UnPromise<T, D>;
}
