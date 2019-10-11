const { fromRoot, hasFile, writeFileToRoot } = require('../../utils')

const eslintConfig = fromRoot('./.eslintrc')
const eslintIgnore = fromRoot('./.eslintignore')

const setupESLint = () => {
  if (hasFile('./.eslintrc')) {
    console.log(`.eslintrc already exists at ${eslintConfig}`)
    console.log('Cancelling ESLint setup')
    process.exit(0)
  }

  const content = '{ "extends": "./node_modules/@itsjonq/zero/eslint.js" }'
  const ignoreContent = 'node_modules\ncoverage\ndist'

  console.log(`Generating ${eslintConfig}...`)
  writeFileToRoot('./.eslintrc', content)

  console.log(`Generating ${eslintIgnore}...`)
  writeFileToRoot('./.eslintignore', ignoreContent)

  console.log()
  console.log('Finished setting up ESLint!')
}

setupESLint()
