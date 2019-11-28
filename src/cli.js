const path = require('path');
const spawn = require('cross-spawn');
const program = require('commander');
const pkg = require('../package.json');

/* eslint-disable no-unused-vars */
const [executor, ignoredBin, script, ...args] = process.argv;
/* eslint-enable no-unused-vars */

program.usage(`

📦  Zero (v${pkg.version})

zero <command>

Example:
  zero build`);

program.version(pkg.version);

program
	.command('build')
	.description('Builds project with Babel, Rollup, or TypeScript')
	.option('--bundle', 'Bundle with Rollup')
	.option('--rollup')
	.option('--roll')
	.option('--typescript', 'Build with TypeScript')
	.option('--tsc')
	.option('--ts')
	.option('--no-clean', 'Skip cleaning the dist directory')
	.allowUnknownOption()
	.action(() => {
		spawnScript('build');
	});

program
	.command('bundle')
	.description('Bundles project into single files with Rollup')
	.option('--no-clean', 'Skip cleaning the dist directory')
	.allowUnknownOption()
	.action(() => {
		spawnScript('bundle');
	});

program
	.command('contributors')
	.description('Generates markdown file with all contributors')
	.action(() => {
		spawnScript('contributors');
	});

program
	.command('format')
	.description('Formats files with Prettier')
	.option('--no-write', 'Does not write changes to files')
	.allowUnknownOption()
	.action(() => {
		spawnScript('format');
	});

program
	.command('lint')
	.description('Lints files with ESLint')
	.option('--no-cache', 'Do not use cache for linting')
	.allowUnknownOption()
	.action(() => {
		spawnScript('lint');
	});

program
	.command('new')
	.description('Generate a new module')
	.allowUnknownOption()
	.action(() => {
		spawnScript('new');
	});

program
	.command('pre-commit')
	.description('Lints files before staging for commit')
	.allowUnknownOption()
	.action(() => {
		spawnScript('pre-commit');
	});

program
	.command('prestart')
	.description('Automatically install dependencies before starting')
	.allowUnknownOption()
	.action(() => {
		spawnScript('prestart');
	});

program
	.command('release')
	.description('Publish to npm')
	.allowUnknownOption()
	.action(() => {
		spawnScript('release');
	});

program
	.command('setup')
	.description('Sets up tooling in project')
	.option('babel', 'Adds a .babelrc file')
	.option('eslint', 'Adds a .eslintrc file')
	.action(cmd => {
		if (typeof cmd !== 'string') {
			cmd.outputHelp();
			return;
		}
		logScriptMessage();
		console.log(`Setting up ${cmd}...`);
		console.log('');

		require(require.resolve(`./scripts/setup/${cmd}`));
	});

program
	.command('test')
	.description('Run test with Jest')
	.option('--runInBand', 'Runs tests sequentially. Improves console.logs')
	.option('--no-watch', 'Does not watch for changes')
	.allowUnknownOption()
	.action(() => {
		spawnScript('test');
	});

program
	.command('typecheck')
	.description('Check types with TypeScript')
	.allowUnknownOption()
	.action(() => {
		spawnScript('typecheck');
	});

program
	.command('validate')
	.description('Validates project with lint, tests, and build')
	.allowUnknownOption()
	.action(() => {
		spawnScript('validate');
	});

function getEnv() {
	// this is required to address an issue in cross-spawn
	// https://github.com/kentcdodds/kcd-scripts/issues/4
	return Object.keys(process.env)
		.filter(key => process.env[key] !== undefined)
		.reduce(
			(envCopy, key) => {
				envCopy[key] = process.env[key];
				return envCopy;
			},
			{
				[`SCRIPTS_${script.toUpperCase()}`]: true,
			},
		);
}

function logScriptMessage() {
	console.log('');
	console.log('📦', '', `Zero ${script}...`);
	console.log('');
}

function spawnScript(script) {
	const relativeScriptPath = path.join(__dirname, './scripts', script);
	const scriptPath = attemptResolve(relativeScriptPath);

	if (!scriptPath) {
		program.outputHelp();
		process.exit(0);
	}

	logScriptMessage();

	const result = spawn.sync(executor, [scriptPath, ...args], {
		stdio: 'inherit',
		env: getEnv(),
	});

	if (result.signal) {
		handleSignal(result);
	} else {
		process.exit(result.status);
	}
}

function handleSignal(result) {
	if (result.signal === 'SIGKILL') {
		console.log(
			`The script "${script}" failed because the process exited too early. ` +
				'This probably means the system ran out of memory or someone called ' +
				'`kill -9` on the process.',
		);
	} else if (result.signal === 'SIGTERM') {
		console.log(
			`The script "${script}" failed because the process exited too early. ` +
				'Someone might have called `kill` or `killall`, or the system could ' +
				'be shutting down.',
		);
	}
	process.exit(1);
}

function attemptResolve(...resolveArgs) {
	try {
		return require.resolve(...resolveArgs);
	} catch (error) {
		return null;
	}
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.outputHelp();
}
