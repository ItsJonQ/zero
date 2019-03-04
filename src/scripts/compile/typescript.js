exports.compileTypeScript = async () => {
  const { tsConfigSrc, hasTsConfig } = require('../../utils')

  const tsConfig = tsConfigSrc()

  if (!hasTsConfig()) {
    console.log(`Could not find ${tsConfig}`)
    process.exit(1)
  }

  try {
    console.log('Compiling with TypeScript...')
    console.log(`Loading ${tsConfig}...`)

    const { execTypeScript } = require('../../exec/typescript')
    const result = await execTypeScript()

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
