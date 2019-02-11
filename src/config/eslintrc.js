const reactLint = require('eslint-config-react-app')

module.exports = Object.assign({}, reactLint, {
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '15.6.1',
    },
  },
})
