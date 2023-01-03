import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';
import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
// @ts-ignore
import bundleSize from 'rollup-plugin-bundle-size';
import terser from '@rollup/plugin-terser';
import type { AddonFunction, ExternalOption } from 'rollup';
import type { PackageJson } from 'type-fest';

const isDevelopment = process.env.ROLLUP_WATCH;
const isProduction = !isDevelopment;

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as PackageJson;
const {
  dependencies = {},
  peerDependencies = {},
  main = './dist/index.cjs',
  module = './dist/index.js',
} = packageJson;

const cjsFooter: AddonFunction = () => 'module.exports = Object.assign(exports.default, exports);';
const esBanner: AddonFunction = ({ modules }) => {
  const entries = Object.entries(modules);
  for (const [_, { code }] of entries) {
    if (code?.includes('__filename') && code?.includes('__dirname')) {
      return "import { fileURLToPath } from 'url'; import { dirname } from 'path'; const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);";
    }
  }
  return '';
};
const external: ExternalOption = [
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies),
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      { file: main, format: 'cjs', exports: 'named', footer: cjsFooter },
      { file: module, format: 'es', banner: esBanner },
    ],
    plugins: [
      json({
        preferConst: true,
      }),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      esbuild({
        target: 'es2017',
      }),
      bundleSize(),
      isProduction
        ? terser({
            compress: {
              drop_console: true,
            },
            format: {
              ascii_only: true,
            },
          })
        : null,
    ],
    external,
  },
  {
    input: './src/index.ts',
    output: { file: './dist/index.d.ts', format: 'es' },
    plugins: [
      dts({
        // https://github.com/Swatinem/rollup-plugin-dts/issues/143
        compilerOptions: { preserveSymlinks: false },
        respectExternal: true,
      }),
      bundleSize(),
    ],
    external,
  },
]);
