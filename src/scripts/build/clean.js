const rimraf = require('rimraf');
const { fromRoot } = require('../../utils');

const args = process.argv.slice(2);
const useSpecifiedOutDir = args.includes('--out-dir');

exports.clean = () => {
	if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
		console.log(`Cleaning ${fromRoot('dist')}...`);
		console.log();
		rimraf.sync(fromRoot('dist'));
	}
};
