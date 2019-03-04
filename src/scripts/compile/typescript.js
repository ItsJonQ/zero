const args = process.argv.slice(2)
const buildArgs = ['--no-clean', '--typescript', '--ts', '--tsc']

exports.compileTypeScript = async () => {
  const { tsConfigSrc, hasTsConfig } = require('../../utils')

  const tsConfig = tsConfigSrc()

  if (!hasTsConfig()) {
    console.log(`Could not find ${tsConfig}`)
    process.exit(1)
  }

  const tsArgs = args.filter(a => !buildArgs.includes(a))

  try {
    if (args.includes('--emitDeclarationOnly')) {
      console.log('Compiling TypeScript declarations only...')
    } else {
      console.log('Compiling with TypeScript...')
    }

    console.log(`Loading ${tsConfig}...`)

    const { execTypeScript } = require('../../exec/typescript')
    const result = await execTypeScript(tsArgs)

    if (result === 1) {
      console.log('Issue compiling with TypeScript :(')
    } else {
      console.log('Successfully compiled with TypeScript!')
    }

    process.exit(result)
  } catch (err) {
    console.log(err)
    console.log('Failed to compile with TypeScript :(')
  }
}
