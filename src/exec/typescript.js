const spawn = require('cross-spawn')
const { resolveBin } = require('../utils')

exports.execTypeScript = async (args = []) => {
  try {
    const result = spawn.sync(
      resolveBin('typescript', { executable: 'tsc' }),
      args,
      { stdio: 'inherit' }
    )

    if (result.status) {
      return Promise.reject(1)
    } else {
      return Promise.resolve(0)
    }
  } catch (err) {
    console.log(err)
    return Promise.reject(1)
  }
}
