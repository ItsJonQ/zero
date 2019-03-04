const babelJest = require('babel-jest')

// From create-react-app + kcd-scripts
module.exports = babelJest.createTransformer({
  presets: [require.resolve('./babelrc')],
  babelrc: false,
  configFile: false,
})
