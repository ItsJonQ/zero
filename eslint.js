const reactLint = require('eslint-config-react-app')

// const kcdLint = require('kcd-scripts/eslint')

// const baseConfig = Object.assign({}, kcdLint, reactLint)

// const rulesConfig = {
//   'import/prefer-default-export': 'off',
//   'import/no-unassigned-import': 'off',
//   'import/extensions': 'off',
//   'no-console': 'off',
//   'no-nested-ternary': 'off',
//   complexity: ['error', 10],
// }

// const enhancedLint = Object.assign(baseConfig, {
//   rules: Object.assign(rulesConfig, baseConfig.rules),
// })

// Going with out-of-the-box react-app Linting config for now.
module.exports = reactLint
