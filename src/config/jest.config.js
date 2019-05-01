const fs = require('fs')
const path = require('path')
const { ifAnyDep, hasFile, hasPkgProp, fromRoot, there } = require('../utils')

const here = p => path.join(__dirname, p)

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel')
// Disabling 100% test coverage defaults.
const shouldHaveTotalCoverage = false

const hasSrcSetupFile = fs.existsSync(there('./src/setupTests.js'))
const hasScriptSetupFile = fs.existsSync(there('./scripts/setupTests.js'))

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
]

// The follow jestConfig is a combination of kcd-scripts and create-react-app.
// kcd-script's setup was used as the foundation because of it's simplicity.
// CRA's settings have been added for TypeScript support.
const jestConfig = {
  roots: [fromRoot('src')],
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  testURL: 'http://localhost',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  // From create-react-app
  collectCoverageFrom: ['src/**/*.+(js|jsx|ts|tsx)', '!src/**/*.d.ts'],
  // From create-react-app
  setupFiles: [require.resolve('react-app-polyfill/jsdom')],
  testMatch: [
    '**/__tests__/**/*.+(js|jsx|ts|tsx)',
    '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.js$'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}

if (useBuiltInBabelConfig) {
  jestConfig.transform = { '^.+\\.(js|jsx|ts|tsx)$': here('./babel-transform') }
}

// Disabled by default.
if (shouldHaveTotalCoverage) {
  jestConfig.coverageThreshold = {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  }
}

if (hasSrcSetupFile) {
  jestConfig.setupFilesAfterEnv = ['<rootDir>/src/setupTests.js']
}
if (hasScriptSetupFile) {
  jestConfig.setupFilesAfterEnv = ['<rootDir>/scripts/setupTests.js']
}

module.exports = jestConfig
