if (process.argv.includes('--browser')) {
  console.error('--browser has been deprecated, use --bundle instead')
}

const shouldBundle =
  process.argv.includes('--bundle') ||
  process.argv.includes('--browser') ||
  process.argv.includes('--rollup') ||
  process.argv.includes('--roll')

const shouldCompileWithTypeScript =
  process.argv.includes('--typescript') ||
  process.argv.includes('--tsc') ||
  process.argv.includes('--ts')

const bundle = () => {
  console.log('Compiling with Rollup...')
  require('./rollup')
}

const build = async () => {
  const { clean } = require('./clean')

  clean()

  if (shouldCompileWithTypeScript) {
    require('../compile/typescript').compileTypeScript()
  } else {
    require('../compile/babel').compileBabel()
  }
}

if (shouldBundle) {
  bundle()
} else {
  build()
}
