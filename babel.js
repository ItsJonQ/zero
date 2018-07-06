const kcdBabel = require('kcd-scripts/babel')

module.exports = {
  presets: kcdBabel.presets.concat(require.resolve('babel-preset-flow')),
  plugins: kcdBabel.plugins.concat(
    require.resolve('babel-plugin-transform-flow-strip-types'),
    require.resolve('babel-plugin-inline-svg')
  ),
}
