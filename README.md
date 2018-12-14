# 📦 Zero [![Build Status](https://travis-ci.org/helpscout/zero.svg?branch=master)](https://travis-ci.org/helpscout/zero) [![npm version](https://badge.fury.io/js/%40helpscout%2Fzero.svg)](https://badge.fury.io/js/%40helpscout%2Fzero)

> Help Scout's zero config scripts

Zero comes with Babel, Rollup, ESLint, Prettier, and Jest - All pre-configured to let you build stuff without fiddling with tooling.

This is all thanks to [kcd-scripts](https://github.com/kentcdodds/kcd-scripts), which powers Zero under the hood.

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#-installation)
- [Usage](#%F0%9F%95%B9-usage)
- [Extending](#-extending)
  - [Babel](#babel)
  - [ESlint](#eslint)
  - [Jest](#jest)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save-dev @helpscout/zero
```

## Usage

Zero comes with a handful of scripts that you can add to your own `package.json` scripts:

```json
"scripts": {
  "prestart": "zero prestart",
  "build": "zero build",
  "lint": "zero lint",
  "format": "zero format",
  "validate": "zero validate",
  "precommit": "zero pre-commit",
}
```

## Extending

### Babel

Create a `babel` or `.babelrc` file with:

```
{"presets": ["@helpscout/zero/babel"]}
```

#### `babel-core@7`

As of version `1.0.0`, Zero is now on `@babel` version 7. Your project may need to install `babel-core@7.0.0-bridge.0`. To do so, add that package to your `package.json`, or run:

```
npm install --save-dev babel-core@7.0.0-bridge.0
```

#### `@babel/runtime`

Zero does **not** include `@babel/runtime`, as it is still being used to compile projects on Babel 6. If you need an ultra-modern Babel 7 ready tool, check out [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

#### `babel-plugin-react-app`

Zero no longer comes with `babel-plugin-react-app`. The reason is because this module uses `@babel/runtime` with the new Babel 7 set up. If your project requires `babel-plugin-react-app` (e.g. building [Docz](https://www.docz.site/)), you'll need to add it yourself as a `devDependencies`.

### ESlint

Create an `.eslintrc` file with:

```
{"extends": "./node_modules/@helpscout/zero/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

### Jest

Create an `jest.config.js` file with:

```javascript
const jestConfig = require('@helpscout/zero/jest')

module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
})
```
