# ci-info

Get details about the current Continuous Integration environment.

Please [open an
issue](https://github.com/watson/ci-info/issues/new?template=ci-server-not-detected.md)
if your CI server isn't properly detected :)

[![npm](https://img.shields.io/npm/v/ci-info.svg)](https://www.npmjs.com/package/ci-info)
[![Build status](https://travis-ci.org/watson/ci-info.svg?branch=master)](https://travis-ci.org/watson/ci-info)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```bash
npm install ci-info --save
```

## Usage

```js
var ci = require('ci-info')

if (ci.isCI) {
  console.log('The name of the CI server is:', ci.name)
} else {
  console.log('This program is not running on a CI server')
}
```

## Supported CI tools

Refer to [Supported CI](https://github.com/watson/ci-info/blob/master/SUPPORTED_CI.md) all supported CI's

## MonoRepo

This is a monorepo for the following packages

- [ci-info](packages/ci-info) - Get details about the current Continuous Integration environment.
- [is-ci](packages/is-ci) - Returns `true` if the current environment is a Continuous Integration server.
- [is-pr](packages/is-pr) - Returns `true` if the current environment is a Continuous Integration server configured to run a PR build.

## License

[MIT](https://github.com/watson/ci-info/blob/master/LICENSE)
