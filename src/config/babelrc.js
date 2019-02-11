const browserslist = require('browserslist')
const semver = require('semver')

const { ifAnyDep, parseEnv, appDirectory, pkg } = require('../utils')

const { BABEL_ENV, NODE_ENV, BUILD_FORMAT } = process.env
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

module.exports = () => ({
  presets: [
    [require.resolve('@babel/preset-env'), envOptions],
    ifAnyDep(
      ['react', 'preact'],
      [
        require.resolve('@babel/preset-react'),
        { pragma: isPreact ? 'React.h' : undefined },
      ]
    ),
    ifAnyDep(['flow-bin'], [require.resolve('@babel/preset-flow')]),
  ].filter(Boolean),
  plugins: [
    isBabelRuntime
      ? [
          require.resolve('@babel/plugin-transform-runtime'),
          { useESModules: treeshake && !isCJS },
        ]
      : null,
    require.resolve('babel-plugin-macros'),
    alias
      ? [
          require.resolve('babel-plugin-module-resolver'),
          { root: ['./src'], alias },
        ]
      : null,
    [
      require.resolve('babel-plugin-transform-react-remove-prop-types'),
      isPreact ? { removeImport: true } : { mode: 'unsafe-wrap' },
    ],
    isUMD
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],
    require.resolve('babel-plugin-minify-dead-code-elimination'),
    treeshake
      ? null
      : require.resolve('@babel/plugin-transform-modules-commonjs'),
    require.resolve('@babel/plugin-transform-flow-strip-types'),
    require.resolve('babel-plugin-inline-svg'),
    require.resolve('babel-plugin-emotion'),
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
