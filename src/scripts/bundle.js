const { clean } = require('./build/clean')

clean()

require('./build/rollup')
