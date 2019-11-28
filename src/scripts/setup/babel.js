const { fromRoot, hasFile, writeFileToRoot } = require('../../utils');

const babelConfig = fromRoot('./.babelrc');

const setupBabel = () => {
	if (hasFile('./.babelrc')) {
		console.log(`.babelrc already exists at ${babelConfig}`);
		console.log('Cancelling Babel setup');
		process.exit(0);
	}

	const content = '{ "presets": ["@itsjonq/zero/babel"] }';

	console.log(`Generating ${babelConfig}...`);
	writeFileToRoot('./.babelrc', content);

	console.log();
	console.log('Finished setting up Babel!');
};

setupBabel();
