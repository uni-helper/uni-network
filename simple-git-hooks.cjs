module.exports = {
  "commit-msg": "npx commitlint --edit ${1}",
  "pre-commit": "npx lint-staged",
};
