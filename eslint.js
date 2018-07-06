const kcdEsLint = require('kcd-scripts/eslint')

module.exports = {
  extends: kcdEsLint.extends,
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-unassigned-import': 'off',
    complexity: ['error', 10],
  },
}
