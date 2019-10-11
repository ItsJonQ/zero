const browserslist = require('browserslist')
const semver = require('semver')

const { ifAnyDep, parseEnv, appDirectory, pkg } = require('../utils')

const { BABEL_ENV, NODE_ENV, BUILD_FORMAT } = process.env
const isProduction = (BABEL_ENV || NODE_ENV) === 'production'
const isTest = (BABEL_ENV || NODE_ENV) === 'test'
const isPreact = parseEnv('BUILD_PREACT', false)
const isRollup = parseEnv('BUILD_ROLLUP', false)
const isUMD = BUILD_FORMAT === 'umd'
const isCJS = BUILD_FORMAT === 'cjs'
const isWebpack = parseEnv('BUILD_WEBPACK', false)
const treeshake = parseEnv('BUILD_TREESHAKE', isRollup || isWebpack)
const alias = parseEnv('BUILD_ALIAS', isPreact ? { react: 'preact' } : null)

/**
 * Custom conditionals
 */
const isTargetNode = process.env.BABEL_TARGET === 'node'
// Prefer to target browsers
const isTargetBrowser = !isTargetNode
// Prefer without runtime
const isBabelRuntime = parseEnv('BUILD_RUNTIME', false)

/**
 * use the strategy declared by browserslist to load browsers configuration.
 * fallback to the default if don't found custom configuration
 * @see https://github.com/browserslist/browserslist/blob/master/node.js#L139
 */
const browsersConfig = browserslist.loadConfig({ path: appDirectory }) || [
  'ie 10',
  'ios 7',
]

const envTargets = isTest
  ? { node: 'current' }
  : isWebpack || isRollup || isTargetBrowser
  ? { browsers: browsersConfig }
  : { node: getNodeVersion(pkg) }

const envOptions = { modules: false, loose: true, targets: envTargets }

// The follow jestConfig is a combination of kcd-scripts and create-react-app.
// kcd-script's setup was used as the foundation because of it's simplicity.
// CRA's settings have been added for TypeScript support.
module.exports = () => ({
  presets: [
    // From kcd-scripts
    [require.resolve('@babel/preset-env'), envOptions],
    // From kcd-scripts
    ifAnyDep(
      ['react', 'preact'],
      [
        require.resolve('@babel/preset-react'),
        {
          pragma: isPreact ? 'React.h' : undefined,
          development: isTest,
          // From create-react-app
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ]
    ),
    // From create-react-app
    // Strip flow types before any other transform, emulating the behavior
    // order as-if the browser supported all of the succeeding features
    // https://github.com/facebook/create-react-app/pull/5182
    // We will conditionally enable this plugin below in overrides as it clashes with
    // @babel/plugin-proposal-decorators when using TypeScript.
    // https://github.com/facebook/create-react-app/issues/5741
    [require.resolve('@babel/preset-flow')],
    // From create-react-app
    [require.resolve('@babel/preset-typescript')],
  ].filter(Boolean),
  plugins: [
    // From create-react-app
    require.resolve('@babel/plugin-transform-flow-strip-types'),
    // From create-react-app
    // Experimental macros support. Will be documented after it's had some time
    // in the wild.
    require.resolve('babel-plugin-macros'),
    // From create-react-app
    // Necessary to include regardless of the environment because
    // in practice some other transforms (such as object-rest-spread)
    // don't work without it: https://github.com/babel/babel/issues/7215
    require.resolve('@babel/plugin-transform-destructuring'),
    // From create-react-app
    // Turn on legacy decorators for TypeScript files
    [require.resolve('@babel/plugin-proposal-decorators'), false],
    // From create-react-app
    // class { handleClick = () => { } }
    // Enable loose mode to use assignment instead of defineProperty
    // See discussion in https://github.com/facebook/create-react-app/issues/4263
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],
    // From create-react-app
    // The following two plugins use Object.assign directly, instead of Babel's
    // extends helper. Note that this assumes `Object.assign` is available.
    // { ...todo, completed: true }
    [
      require('@babel/plugin-proposal-object-rest-spread').default,
      {
        useBuiltIns: true,
      },
    ],
    // From create-react-app
    // Polyfills the runtime needed for async/await, generators, and friends
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime
    isBabelRuntime
      ? [
          require.resolve('@babel/plugin-transform-runtime'),
          {
            useESModules: treeshake && !isCJS,
            corejs: false,
            regenerator: true,
          },
        ]
      : null,
    // From create-react-app
    // Remove PropTypes from production build
    isProduction
      ? [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          isPreact ? { removeImport: true } : { mode: 'unsafe-wrap' },
        ]
      : null,
    // From create-react-app
    // Adds syntax support for import()
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    // From kcd-scripts
    alias
      ? [
          require.resolve('babel-plugin-module-resolver'),
          { root: ['./src'], alias },
        ]
      : null,
    // From kcd-scripts
    isUMD
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    // From kcd-scripts
    require.resolve('babel-plugin-minify-dead-code-elimination'),
    // From kcd-scripts
    treeshake
      ? null
      : require.resolve('@babel/plugin-transform-modules-commonjs'),
    require.resolve('babel-plugin-inline-svg'),
    require.resolve('babel-plugin-emotion'),
    require.resolve('babel-plugin-styled-components'),
  ].filter(Boolean),
  // From create-react-app
  overrides: [
    {
      test: /\.{js,jsx,ts,tsx}?$/,
      plugins: [require.resolve('@babel/plugin-transform-flow-strip-types')],
    },
    {
      test: /\.{js,jsx,ts,tsx}?$/,
      plugins: [
        [
          require.resolve('@babel/plugin-proposal-decorators'),
          { legacy: true },
        ],
      ],
    },
  ].filter(Boolean),
})

function getNodeVersion({ engines: { node: nodeVersion = '8' } = {} }) {
  const oldestVersion = semver
    .validRange(nodeVersion)
    .replace(/[>=<|]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .sort(semver.compare)[0]
  if (!oldestVersion) {
    throw new Error(
      `Unable to determine the oldest version in the range in your package.json at engines.node: "${nodeVersion}". Please attempt to make it less ambiguous.`
    )
  }
  return oldestVersion
}
