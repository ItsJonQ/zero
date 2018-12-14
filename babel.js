const kcdBabel = require('./dist/config/babelrc')()

module.exports = function zeroBabel() {
  return {
    presets: kcdBabel.presets,
    plugins: kcdBabel.plugins.concat(
      require.resolve('@babel/plugin-transform-flow-strip-types'),
      require.resolve('babel-plugin-inline-svg'),
      require.resolve('babel-plugin-emotion')
    ),
  }
}
