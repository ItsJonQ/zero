# 📦 Zero

[![Build Status](https://travis-ci.org/itsjonq/zero.svg?branch=master)](https://travis-ci.org/itsjonq/zero)
[![npm version](https://badge.fury.io/js/%40itsjonq%2Fzero.svg)](https://badge.fury.io/js/%40itsjonq%2Fzero)
![node](https://img.shields.io/badge/node-8.11.3-blue.svg)
![npm](https://img.shields.io/badge/npm-6.4.1-blue.svg)

> A zero config scripts library

Zero is a ["zero config"](https://www.google.com/search?ei=eGJ7XPqGG5K_jgS2wYKoCA&q=javascript+zero+config&oq=javascript+zero+config&gs_l=psy-ab.3..0i22i30l2.2204.6555..6634...4.0..0.88.1939.29......0....1..gws-wiz.......0i71j0i131j0j0i67.eDv8lllu1MY) tool designed to make it easy to create, develop, test, build, and publish libraries.

It comes with a bunch of modern front-end tools, like Babel, Rollup, ESLint, Prettier, and Jest - All pre-configured to let you build stuff without fiddling with configuration files, scripts and commands.

```
📦  Zero

zero <command>

Example:
  zero build

Options:
  -V, --version     output the version number
  -h, --help        output usage information

Commands:
  build [options]   Builds project with Babel, Rollup, or TypeScript
  bundle [options]  Bundles project into single files with Rollup
  contributors      Generates markdown file with all contributors
  format [options]  Formats files with Prettier
  lint [options]    Lints files with ESLint
  new               Generate a new module
  pre-commit        Lints files before staging for commit
  prestart          Automatically install dependencies before starting
  release           Publish to npm
  setup [options]   Sets up tooling in project
  test [options]    Run test with Jest
  typecheck         Check types with TypeScript
  validate          Validates project with lint, tests, and build
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
- [Extending](#extending)
  - [Babel](#babel)
  - [ESlint](#eslint)
  - [Jest](#jest)
  - [Prettier](#prettier)
- [Thanks](#thanks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

Add Zero to your project with this command:

```
npm install --save-dev @itsjonq/zero
```

Or globally with:

```
npm install -g @itsjonq/zero
```

## Usage

Zero comes with a handful of scripts that you can add to your own `package.json` scripts:

```json
"scripts": {
  "prestart": "zero prestart",
  "build": "zero build",
  "format": "zero format",
  "lint": "zero lint",
  "precommit": "zero pre-commit",
  "release": "zero release",
  "test": "zero test",
  "validate": "zero validate",
}
```

### CLI

To use Zero as a CLI, install it globally, then run this command:

```
zero
```

Alternatively, you can run it with [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)

```
npx @itsjonq/zero
```

## Extending

Zero can build, lint, format, and release out-of-the-box!

If you need to personalize Babel, ESLint, or Jest, Zero's got you covered. Add your own adjustments by extending Zero's based configurations.

### Babel

Create a `babel` or `.babelrc` file with:

```
{"presets": ["@itsjonq/zero/babel"]}
```

#### `babel-core@7`

As of version `1.0.0`, Zero is now on `@babel` version 7. Your project may need to install `babel-core@7.0.0-bridge.0`. To do so, add that package to your `package.json`, or run:

```
npm install --save-dev babel-core@7.0.0-bridge.0
```

#### `@babel/runtime`

Zero **does not use** `@babel/runtime`, as it is still being used to compile projects on Babel 6. If you need an ultra-modern Babel 7 ready tool, check out [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

#### `babel-plugin-react-app`

Zero no longer comes with `babel-plugin-react-app`. The reason is because this module uses `@babel/runtime` with the new Babel 7 set up. If your project requires `babel-plugin-react-app` (e.g. building [Docz](https://www.docz.site/)), you'll need to add it yourself as a `devDependencies`.

### ESlint

Create an `.eslintrc` file with:

```
{"extends": "./node_modules/@itsjonq/zero/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

### Jest

Create a `jest.config.js` file with:

```javascript
const jestConfig = require('@itsjonq/zero/jest')

module.exports = Object.assign(jestConfig, {
  // your overrides here
})
```

### Prettier

Create a `.prettierrc.js` file with:

```
module.exports = require("@itsjonq/zero/prettier");
```

## Thanks

Thanks to [kcd-scripts](https://github.com/kentcdodds/kcd-scripts) and [create-react-app](https://github.com/facebook/create-react-app) for the inspiration and code!
