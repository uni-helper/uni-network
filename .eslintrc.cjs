module.exports = {
  extends: [require.resolve('@modyqyw/fabric/eslint')],
  rules: {
    'sonarjs/cognitive-complexity': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/no-thenable': 'off',
    'unicorn/error-message': 'off',
  },
};
