import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index', './src/composables'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'es2017',
    },
  },
  hooks: {
    'build:done': (ctx) => {
      const cjs = resolve(ctx.options.outDir, 'index.cjs');
      appendFileSync(cjs, 'module.exports = Object.assign(exports.default || {}, exports);');
    },
  },
});
