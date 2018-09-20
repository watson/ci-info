'use strict'

const assert = require('assert')
const clearModule = require('clear-module')

// On Travis, building a PR
{
  process.env.TRAVIS = 'true'
  process.env.TRAVIS_PULL_REQUEST = '42'

  const isPR = require('./')
  assert.strictEqual(isPR, true)

  clearModule('./')
  clearModule('ci-info')
}

// On Travis, not building a PR
{
  process.env.TRAVIS_PULL_REQUEST = 'false'

  const isPR = require('./')
  assert.strictEqual(isPR, false)

  clearModule('./')
  clearModule('ci-info')
}

// On a generic CI server
{
  delete process.env.TRAVIS_PULL_REQUEST
  delete process.env.TRAVIS
  process.env.CI = 'true'

  const isPR = require('./')
  assert.strictEqual(isPR, null)

  clearModule('./')
  clearModule('ci-info')
}

// Not on a CI server
{
  delete process.env.CI
  delete process.env.CONTINUOUS_INTEGRATION
  delete process.env.BUILD_NUMBER
  delete process.env.TRAVIS_PULL_REQUEST
  delete process.env.TRAVIS

  const isPR = require('./')
  assert.strictEqual(isPR, null)
}
