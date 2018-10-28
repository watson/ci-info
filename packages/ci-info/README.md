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

## API

### `ci.name`

Returns a string containing name of the CI server the code is running on.
If CI server is not detected, it returns `null`.

Don't depend on the value of this string not to change for a specific
vendor. If you find your self writing `ci.name === 'Travis CI'`, you
most likely want to use `ci.TRAVIS` instead.

### `ci.isCI`

Returns a boolean. Will be `true` if the code is running on a CI server,
otherwise `false`.

Some CI servers not listed here might still trigger the `ci.isCI`
boolean to be set to `true` if they use certain vendor neutral
environment variables. In those cases `ci.name` will be `null` and no
vendor specific boolean will be set to `true`.

### `ci.isPR`

Returns a boolean if PR detection is supported for the current CI server. Will
be `true` if a PR is being tested, otherwise `false`. If PR detection is
not supported for the current CI server, the value will be `null`.

### `ci.<VENDOR-CONSTANT>`

A vendor specific boolean constant is exposed for each support CI
vendor. A constant will be `true` if the code is determined to run on
the given CI server, otherwise `false`.

Examples of vendor constants are `ci.TRAVIS` or `ci.APPVEYOR`. For a
complete list, see the support table above.

## License

[MIT](https://github.com/watson/ci-info/blob/master/LICENSE)
