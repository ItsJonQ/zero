exports.compileBabel = async () => {
  console.log('Compiling with Babel...')

  try {
    const { buildBabel } = require('../build/babel')
    const result = await buildBabel()
    process.exit(result)
  } catch (err) {
    console.log(err)
    console.log('Failed to compile with Babel :(')
  }
}
