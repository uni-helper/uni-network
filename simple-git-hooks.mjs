export default {
  // biome-ignore lint/suspicious/noTemplateCurlyInString: Expected.
  "commit-msg": "npx commitlint --edit ${1}",
  "pre-commit": "npx lint-staged",
};
