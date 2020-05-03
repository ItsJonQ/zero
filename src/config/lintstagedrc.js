const { resolveZeroScripts, resolveBin, isOptedOut } = require('../utils');

const zeroScripts = resolveZeroScripts();
const doctoc = resolveBin('doctoc');

module.exports = {
	'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
	'*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
		isOptedOut('autoformat', null, `${zeroScripts} format`),
		`${zeroScripts} lint`,
		`${zeroScripts} test --findRelatedTests`,
		isOptedOut('autoformat', null, 'git add'),
	].filter(Boolean),
};
