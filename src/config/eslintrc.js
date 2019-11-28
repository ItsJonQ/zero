const { ifAnyDep } = require('../utils');

module.exports = {
	extends: [
		ifAnyDep('react', require.resolve('eslint-config-react-app')),
	].filter(Boolean),
	rules: {},
};
