const { ifAnyDep } = require('../utils');

module.exports = {
	extends: [
		'eslint:recommended',
		'eslint-config-kentcdodds/jest',
		ifAnyDep('react', require.resolve('eslint-config-react-app')),
	].filter(Boolean),
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			modules: true,
		},
	},
	globals: {
		console: true,
		global: true,
		module: true,
	},
	rules: {},
};
