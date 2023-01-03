import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { rollupIndexConfig, rollupIndexTypesConfig } from '@modyqyw/utils';
import type { PackageJson } from 'type-fest';

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as PackageJson;

export default defineConfig([rollupIndexConfig(packageJson), rollupIndexTypesConfig(packageJson)]);
