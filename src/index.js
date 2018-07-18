#!/usr/bin/env node

const args = process.argv.slice(2)
const command = args[0]

if (command && command.toLowerCase() === 'build') {
  /* eslint dot-notation: 0 */
  if (!process.env['BABEL_ENV']) {
    process.env['BABEL_ENV'] = 'production'
  }
}

require('kcd-scripts/dist/index')
