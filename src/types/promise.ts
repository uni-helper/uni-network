import { UnData } from './common';
import { UnResponse } from './response';

export type UnPromise<T = UnData, D = UnData> = Promise<UnResponse<T, D>>;
