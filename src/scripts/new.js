const spawn = require('cross-spawn')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const glob = require('fast-glob')
const mkdirp = require('mkdirp')
const template = require('lodash.template')
const pkg = require('../../package.json')

const here = p => path.resolve(__dirname, p)

exports.execNew = async () => {
  console.log('Creating a new module\n')

  const pwd = process.cwd()
  const prompts = await inquirer.prompt([
    {
      type: 'input',
      name: 'module_name',
      message: "Module name? (Don't include @scope)",
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Scope? (Press enter to skip)',
    },
  ])

  const answers = exports.remapPromptsToAnswers(prompts)
  const { module_name } = answers

  try {
    // Create the new directory
    const dest = path.join(pwd, module_name)
    const destSrc = path.join(dest, 'src')
    mkdirp.sync(destSrc)

    // Generating the new files
    console.log('')
    console.log('🗂', '', 'Generating files...')
    exports.generateTemplateFiles(dest, answers)
    console.log('')
    console.log('🚚', '', 'Installing dependencies...')
    spawn.sync('npm', ['--prefix', dest, 'install'])
    console.log('')
    console.log('✨', '', 'Success!')
    console.log('Your new module is available at', dest)
    console.log('')
    console.log('To start, run:')
    console.log(`cd ./${module_name}`)
    console.log('')
    console.log('Happy Coding!')
  } catch (err) {
    console.log('')
    console.log("Hmm! Zero wasn't able to generate a new module.")
  }
}

exports.getTemplateFiles = () => {
  const templateDir = here('../templates')
  const templateFilePath = path.join(templateDir, '/**/(*|.*)')
  const templateFiles = glob.sync(templateFilePath)

  return templateFiles
}

exports.getTemplateProps = rawProps => {
  const { module_name, scope } = rawProps
  const pkgName = scope ? `@${scope}/${module_name}` : module_name

  return {
    name: module_name,
    scope,
    pkgName,
    zeroVersion: pkg.version,
  }
}

exports.generateTemplateFiles = (dest, rawProps) => {
  const templateFiles = exports.getTemplateFiles()
  const props = exports.getTemplateProps(rawProps)

  const srcIndexDest = path.join(dest, 'src/index.js')
  const srcPrettierDest = path.join(dest, '.prettierrc.js')
  const srcESLintRc = path.join(dest, '.eslinrc')

  templateFiles.forEach(file => {
    const fileContent = fs.readFileSync(file, 'utf8')
    const compiled = template(fileContent)(props)
    const templateDestBase = file.split('/templates/')[1]
    const templateDest = path.join(dest, templateDestBase)

    fs.writeFileSync(templateDest, compiled)
    console.log(`Generated ${templateDest}`)
  })

  // Create the src/index.js file
  fs.writeFileSync(srcIndexDest, '// Happy Coding!')
  console.log(`Generated ${srcIndexDest}`)

  // Create the src/.prettierrc.js file
  fs.writeFileSync(
    srcPrettierDest,
    "module.exports = require('@itsjonq/zero/prettier')"
  )

  fs.writeFileSync(
    srcESLintRc,
    '{ "extends": "./node_modules/@itsjonq/zero/eslint.js" }'
  )
  console.log(`Generated ${srcPrettierDest}`)
}

exports.remapPromptsToAnswers = prompts => {
  return Object.keys(prompts).reduce((acc, key) => {
    let value = prompts[key]
    if (key === 'scope') {
      value = value.replace('@', '')
    }
    acc[key] = value

    return acc
  }, {})
}

exports.execNew()
