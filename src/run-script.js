const path = require('path')
const spawn = require('cross-spawn')
const pkg = require('../package.json')

/* eslint-disable no-unused-vars */
const [executor, ignoredBin, script, ...args] = process.argv
/* eslint-enable no-unused-vars */

const fullMessage = `
📦  Zero (v${pkg.version})

Usage: zero <command> [--flags]

Commands:
🛠  build           Builds project with Babel (7)
📦  bundle          Bundles project into single files with Rollup
😊  contributors    Generates markdown file with all contributors
💅  format          Formats files with Prettier
🔍  lint            Lints files with ESLint
✨  new             Generate a new module
☝️  pre-commit      Lints files before staging for commit
🔑  prestart        Automatically install dependencies before starting
🚚  release         Publish to npm
🤞  test            Run tests with Jest
💪  validate        Validates project with lint, tests, and build
  `.trim()

const logHelpMessage = () => {
  console.log(`\n${fullMessage}\n`)
}

if (script) {
  spawnScript()
} else {
  logHelpMessage()
}

function getEnv() {
  // this is required to address an issue in cross-spawn
  // https://github.com/kentcdodds/kcd-scripts/issues/4
  return Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key]
        return envCopy
      },
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true,
      }
    )
}

function spawnScript() {
  const relativeScriptPath = path.join(__dirname, './scripts', script)
  const scriptPath = attemptResolve(relativeScriptPath)

  if (!scriptPath) {
    logHelpMessage()
    process.exit(0)
  }
  console.log('')
  console.log('📦', '', `Zero ${script}...`)
  console.log('')

  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: 'inherit',
    env: getEnv(),
  })

  if (result.signal) {
    handleSignal(result)
  } else {
    process.exit(result.status)
  }
}

function handleSignal(result) {
  if (result.signal === 'SIGKILL') {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    )
  }
  process.exit(1)
}

function attemptResolve(...resolveArgs) {
  try {
    return require.resolve(...resolveArgs)
  } catch (error) {
    return null
  }
}
