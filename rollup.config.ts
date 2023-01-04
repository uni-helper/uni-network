import { defineConfig } from 'rollup';
import { rollupIndexConfig, rollupIndexTypesConfig } from '@modyqyw/utils';

export default defineConfig([rollupIndexConfig(), rollupIndexTypesConfig()]);
