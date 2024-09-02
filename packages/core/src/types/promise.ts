import type { UnData } from './common';
import type { UnResponse } from './response';

export type UnPromise<T = UnData, D = UnData> = Promise<UnResponse<T, D>>;
