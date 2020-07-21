const { ifAnyDep } = require('../utils');

module.exports = {
	extends: [
		'eslint:recommended',
		'eslint-config-kentcdodds/jest',
		ifAnyDep('react', require.resolve('eslint-config-react-app')),
		'prettier',
	].filter(Boolean),
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			modules: true,
		},
	},
	plugins: [
		'better-styled-components',
		'react',
		'simple-import-sort',
		'sort-keys-fix',
		'sort-destructure-keys',
	],
	globals: {
		console: true,
		global: true,
		module: true,
	},
	rules: {
		'better-styled-components/sort-declarations-alphabetically': 2,
		'sort-destructure-keys/sort-destructure-keys': 2,
		'sort-keys-fix/sort-keys-fix': 'warn',
		'sort-imports': 'off',
		'import/order': 'off',
		'simple-import-sort/sort': 'error',
		'react/jsx-sort-props': 'error',
	},
};
