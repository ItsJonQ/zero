const jestConfig = require('kcd-scripts/jest')

module.exports = Object.assign({}, jestConfig, {
  testURL: 'http://localhost/',
})
