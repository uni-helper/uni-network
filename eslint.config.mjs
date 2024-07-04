import { eslint } from '@modyqyw/fabric';

export default eslint({
  perfectionist: false,
  unicorn: {
    rules: {
      'unicorn/consistent-destructuring': 'off',
      'unicorn/error-message': 'off',
      'unicorn/filename-case': 'off',
    },
  },
});
