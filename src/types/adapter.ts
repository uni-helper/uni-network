import { UnData } from './common';
import { UnConfig } from './config';
import { UnPromise } from './promise';

export interface UnAdapter<T = UnData, D = UnData> {
  (config: UnConfig<T, D>): UnPromise<T, D>;
}
