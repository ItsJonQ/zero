const { tsConfigSrc, hasTsConfig } = require('../utils');
const { execTypeScript } = require('../exec/typescript');

const tsConfig = tsConfigSrc();

const check = async () => {
	if (!hasTsConfig()) {
		console.log(`Could not find ${tsConfig}`);
		return;
	}

	console.log('Type checking with TypeScript...');
	console.log(`Loading ${tsConfig}...`);
	const result = await execTypeScript(['--noEmit']);

	console.log();
	if (result === 1) {
		console.log('We noticed type issues :(');
	} else {
		console.log('No type issues found!');
	}
};

check();
