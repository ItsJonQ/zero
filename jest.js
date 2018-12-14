const jestConfig = require('./dist/config/jest.config')

module.exports = Object.assign(jestConfig, {
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
})
