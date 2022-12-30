import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    shims: true,
    splitting: false,
    target: 'esnext',
    define: {
      'process.env.UNI_PLATFORM': 'process.env.UNI_PLATFORM',
      'import.meta.env.UNI_PLATFORM': 'import.meta.env.UNI_PLATFORM',
    },
    banner: ({ format }) => {
      if (format === 'esm') {
        return {
          // eslint-disable-next-line no-useless-escape
          js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
        };
      }
    },
    footer: ({ format }) => {
      if (format === 'cjs') {
        return {
          js: `if (module.exports.default) module.exports = module.exports.default;`,
        };
      }
    },
  },
]);
