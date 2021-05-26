'use strict'

const test = require('tape')
const clearModule = require('clear-module')

const isActualPR = !!(process.env.GITHUB_EVENT_NAME && process.env.GITHUB_EVENT_NAME === 'pull_request')

test('Known CI', function (t) {
  process.env.GITHUB_ACTIONS = 'true'

  const ci = require('./')

  t.ok(Array.isArray(ci._vendors))
  t.ok(ci._vendors.length > 0)

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, isActualPR)
  t.equal(ci.name, 'GitHub Actions')
  t.equal(ci.GITHUB_ACTIONS, true)
  assertVendorConstants('GITHUB_ACTIONS', ci, t)

  t.end()
})

test('Not CI', function (t) {
  delete process.env.CI
  delete process.env.CONTINUOUS_INTEGRATION
  delete process.env.BUILD_NUMBER
  delete process.env.TRAVIS
  delete process.env.GITHUB_ACTIONS

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, false)
  t.equal(ci.isPR, null)
  t.equal(ci.name, null)
  t.equal(ci.TRAVIS, false)
  assertVendorConstants(null, ci, t)

  t.end()
})

test('Unknown CI', function (t) {
  process.env.CI = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, null)
  t.equal(ci.name, null)
  t.equal(ci.TRAVIS, false)
  assertVendorConstants(null, ci, t)

  t.end()
})

test('AppVeyor - PR', function (t) {
  process.env.APPVEYOR = 'true'
  process.env.APPVEYOR_PULL_REQUEST_NUMBER = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'AppVeyor')
  t.equal(ci.APPVEYOR, true)
  assertVendorConstants('APPVEYOR', ci, t)

  delete process.env.APPVEYOR
  delete process.env.APPVEYOR_PULL_REQUEST_NUMBER

  t.end()
})

test('AppVeyor - Not PR', function (t) {
  process.env.APPVEYOR = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'AppVeyor')
  t.equal(ci.APPVEYOR, true)
  assertVendorConstants('APPVEYOR', ci, t)

  delete process.env.APPVEYOR

  t.end()
})

test('Azure Pipelines - PR', function (t) {
  process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = 'https://dev.azure.com/Contoso'
  process.env.SYSTEM_PULLREQUEST_PULLREQUESTID = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Azure Pipelines')
  t.equal(ci.AZURE_PIPELINES, true)
  assertVendorConstants('AZURE_PIPELINES', ci, t)

  delete process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI
  delete process.env.SYSTEM_PULLREQUEST_PULLREQUESTID

  t.end()
})

test('Azure Pipelines - Not PR', function (t) {
  process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = 'https://dev.azure.com/Contoso'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Azure Pipelines')
  t.equal(ci.AZURE_PIPELINES, true)
  assertVendorConstants('AZURE_PIPELINES', ci, t)

  delete process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI

  t.end()
})

test('Bitbucket Pipelines - PR', function (t) {
  process.env.BITBUCKET_COMMIT = 'true'
  process.env.BITBUCKET_PR_ID = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Bitbucket Pipelines')
  t.equal(ci.BITBUCKET, true)
  assertVendorConstants('BITBUCKET', ci, t)

  delete process.env.BITBUCKET_COMMIT
  delete process.env.BITBUCKET_PR_ID

  t.end()
})

test('Bitbucket Pipelines - Not PR', function (t) {
  process.env.BITBUCKET_COMMIT = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Bitbucket Pipelines')
  t.equal(ci.BITBUCKET, true)
  assertVendorConstants('BITBUCKET', ci, t)

  delete process.env.BITBUCKET_COMMIT

  t.end()
})

test('Buildkite - PR', function (t) {
  process.env.BUILDKITE = 'true'
  process.env.BUILDKITE_PULL_REQUEST = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Buildkite')
  t.equal(ci.BUILDKITE, true)
  assertVendorConstants('BUILDKITE', ci, t)

  delete process.env.BUILDKITE
  delete process.env.BUILDKITE_PULL_REQUEST

  t.end()
})

test('Buildkite - Not PR', function (t) {
  process.env.BUILDKITE = 'true'
  process.env.BUILDKITE_PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Buildkite')
  t.equal(ci.BUILDKITE, true)
  assertVendorConstants('BUILDKITE', ci, t)

  delete process.env.BUILDKITE
  delete process.env.BUILDKITE_PULL_REQUEST

  t.end()
})

test('CircleCI - PR', function (t) {
  process.env.CIRCLECI = 'true'
  process.env.CIRCLE_PULL_REQUEST = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'CircleCI')
  t.equal(ci.CIRCLE, true)
  assertVendorConstants('CIRCLE', ci, t)

  delete process.env.CIRCLECI
  delete process.env.CIRCLE_PULL_REQUEST

  t.end()
})

test('CircleCI - Not PR', function (t) {
  process.env.CIRCLECI = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'CircleCI')
  t.equal(ci.CIRCLE, true)
  assertVendorConstants('CIRCLE', ci, t)

  delete process.env.CIRCLECI

  t.end()
})

test('Cirrus CI - PR', function (t) {
  process.env.CIRRUS_CI = 'true'
  process.env.CIRRUS_PR = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Cirrus CI')
  t.equal(ci.CIRRUS, true)
  assertVendorConstants('CIRRUS', ci, t)

  delete process.env.CIRRUS_CI
  delete process.env.CIRRUS_PR

  t.end()
})

test('Cirrus CI - Not PR', function (t) {
  process.env.CIRRUS_CI = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Cirrus CI')
  t.equal(ci.CIRRUS, true)
  assertVendorConstants('CIRRUS', ci, t)

  delete process.env.CIRRUS_CI

  t.end()
})

test('Codefresh - PR', function (t) {
  process.env.CF_BUILD_ID = 'true'
  process.env.CF_PULL_REQUEST_ID = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Codefresh')
  t.equal(ci.CODEFRESH, true)
  assertVendorConstants('CODEFRESH', ci, t)

  delete process.env.CF_BUILD_ID
  delete process.env.CF_PULL_REQUEST_ID

  t.end()
})

test('Codefresh - Not PR', function (t) {
  process.env.CF_BUILD_ID = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Codefresh')
  t.equal(ci.CODEFRESH, true)
  assertVendorConstants('CODEFRESH', ci, t)

  delete process.env.CF_BUILD_ID

  t.end()
})

test('LayerCI - PR', function (t) {
  process.env.LAYERCI = 'true'
  process.env.LAYERCI_PULL_REQUEST = 'https://link-to-pr/5'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'LayerCI')
  t.equal(ci.LAYERCI, true)
  assertVendorConstants('LAYERCI', ci, t)

  delete process.env.LAYERCI
  delete process.env.LAYERCI_PULL_REQUEST

  t.end()
})

test('LayerCI - Not PR', function (t) {
  process.env.LAYERCI = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'LayerCI')
  t.equal(ci.LAYERCI, true)
  assertVendorConstants('LAYERCI', ci, t)

  delete process.env.LAYERCI

  t.end()
})

test('Appcircle', function (t) {
  process.env.AC_APPCIRCLE = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Appcircle')
  t.equal(ci.APPCIRCLE, true)
  assertVendorConstants('APPCIRCLE', ci, t)

  delete process.env.AC_APPCIRCLE

  t.end()
})

test('Render - PR', function (t) {
  process.env.RENDER = 'true'
  process.env.IS_PULL_REQUEST = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Render')
  t.equal(ci.RENDER, true)
  assertVendorConstants('RENDER', ci, t)

  delete process.env.RENDER
  delete process.env.IS_PULL_REQUEST

  t.end()
})

test('Render - Not PR', function (t) {
  process.env.RENDER = 'true'
  process.env.IS_PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Render')
  t.equal(ci.RENDER, true)
  assertVendorConstants('RENDER', ci, t)

  delete process.env.RENDER
  delete process.env.IS_PULL_REQUEST

  t.end()
})

test('Semaphore - PR', function (t) {
  process.env.SEMAPHORE = 'true'
  process.env.PULL_REQUEST_NUMBER = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Semaphore')
  t.equal(ci.SEMAPHORE, true)
  assertVendorConstants('SEMAPHORE', ci, t)

  delete process.env.SEMAPHORE
  delete process.env.PULL_REQUEST_NUMBER

  t.end()
})

test('Semaphore - Not PR', function (t) {
  process.env.SEMAPHORE = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Semaphore')
  t.equal(ci.SEMAPHORE, true)
  assertVendorConstants('SEMAPHORE', ci, t)

  delete process.env.SEMAPHORE

  t.end()
})

test('Shippable - PR', function (t) {
  process.env.SHIPPABLE = 'true'
  process.env.IS_PULL_REQUEST = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Shippable')
  t.equal(ci.SHIPPABLE, true)
  assertVendorConstants('SHIPPABLE', ci, t)

  delete process.env.SHIPPABLE
  delete process.env.IS_PULL_REQUEST

  t.end()
})

test('Semaphore - Not PR', function (t) {
  process.env.SHIPPABLE = 'true'
  process.env.IS_PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Shippable')
  t.equal(ci.SHIPPABLE, true)
  assertVendorConstants('SHIPPABLE', ci, t)

  delete process.env.SHIPPABLE
  delete process.env.IS_PULL_REQUEST

  t.end()
})

test('Solano CI - PR', function (t) {
  process.env.TDDIUM = 'true'
  process.env.TDDIUM_PR_ID = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Solano CI')
  t.equal(ci.SOLANO, true)
  assertVendorConstants('SOLANO', ci, t)

  delete process.env.TDDIUM
  delete process.env.TDDIUM_PR_ID

  t.end()
})

test('Solano CI - Not PR', function (t) {
  process.env.TDDIUM = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Solano CI')
  t.equal(ci.SOLANO, true)
  assertVendorConstants('SOLANO', ci, t)

  delete process.env.TDDIUM

  t.end()
})

test('Travis CI - PR', function (t) {
  process.env.TRAVIS = 'true'
  process.env.TRAVIS_PULL_REQUEST = '42'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Travis CI')
  t.equal(ci.TRAVIS, true)
  assertVendorConstants('TRAVIS', ci, t)

  delete process.env.TRAVIS
  delete process.env.TRAVIS_PULL_REQUEST

  t.end()
})

test('Travis CI - Not PR', function (t) {
  process.env.TRAVIS = 'true'
  process.env.TRAVIS_PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Travis CI')
  t.equal(ci.TRAVIS, true)
  assertVendorConstants('TRAVIS', ci, t)

  delete process.env.TRAVIS
  delete process.env.TRAVIS_PULL_REQUEST

  t.end()
})

test('Netlify CI - PR', function (t) {
  process.env.NETLIFY = 'true'
  process.env.PULL_REQUEST = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Netlify CI')
  t.equal(ci.NETLIFY, true)
  assertVendorConstants('NETLIFY', ci, t)

  delete process.env.NETLIFY
  delete process.env.PULL_REQUEST

  t.end()
})

test('Netlify CI - Not PR', function (t) {
  process.env.NETLIFY = 'true'
  process.env.PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Netlify CI')
  t.equal(ci.NETLIFY, true)
  assertVendorConstants('NETLIFY', ci, t)

  delete process.env.NETLIFY
  delete process.env.PULL_REQUEST

  t.end()
})

test('Vercel', function (t) {
  process.env.NOW_BUILDER = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, null)
  t.equal(ci.name, 'Vercel')
  t.equal(ci.VERCEL, true)
  assertVendorConstants('VERCEL', ci, t)

  delete process.env.NOW_BUILDER

  t.end()
})

test('Nevercode - PR', function (t) {
  process.env.NEVERCODE = 'true'
  process.env.NEVERCODE_PULL_REQUEST = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Nevercode')
  t.equal(ci.NEVERCODE, true)
  assertVendorConstants('NEVERCODE', ci, t)

  delete process.env.NEVERCODE
  delete process.env.NEVERCODE_PULL_REQUEST

  t.end()
})

test('Nevercode - Not PR', function (t) {
  process.env.NEVERCODE = 'true'
  process.env.NEVERCODE_PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Nevercode')
  t.equal(ci.NEVERCODE, true)
  assertVendorConstants('NEVERCODE', ci, t)

  delete process.env.NEVERCODE
  delete process.env.NEVERCODE_PULL_REQUEST

  t.end()
})

test('GitHub Actions - PR', function (t) {
  process.env.GITHUB_ACTIONS = 'true'
  process.env.GITHUB_EVENT_NAME = 'pull_request'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'GitHub Actions')
  t.equal(ci.GITHUB_ACTIONS, true)
  assertVendorConstants('GITHUB_ACTIONS', ci, t)

  delete process.env.GITHUB_ACTIONS
  delete process.env.GITHUB_EVENT_NAME

  t.end()
})

test('GitHub Actions - Not PR', function (t) {
  process.env.GITHUB_ACTIONS = 'true'
  process.env.GITHUB_EVENT_NAME = 'push'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'GitHub Actions')
  t.equal(ci.GITHUB_ACTIONS, true)
  assertVendorConstants('GITHUB_ACTIONS', ci, t)

  delete process.env.GITHUB_ACTIONS
  delete process.env.GITHUB_EVENT_NAME

  t.end()
})

test('Screwdriver - PR', function (t) {
  process.env.SCREWDRIVER = 'true'
  process.env.SD_PULL_REQUEST = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Screwdriver')
  t.equal(ci.SCREWDRIVER, true)
  assertVendorConstants('SCREWDRIVER', ci, t)

  delete process.env.SCREWDRIVER
  delete process.env.SD_PULL_REQUEST

  t.end()
})

test('Screwdriver - Not PR', function (t) {
  process.env.SCREWDRIVER = 'true'
  process.env.SD_PULL_REQUEST = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Screwdriver')
  t.equal(ci.SCREWDRIVER, true)
  assertVendorConstants('SCREWDRIVER', ci, t)

  delete process.env.SCREWDRIVER
  delete process.env.SD_PULL_REQUEST

  t.end()
})

test('Visual Studio App Center', function (t) {
  process.env.APPCENTER_BUILD_ID = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  // t.equal(ci.isPR, false)
  t.equal(ci.name, 'Visual Studio App Center')
  t.equal(ci.APPCENTER, true)
  assertVendorConstants('APPCENTER', ci, t)

  delete process.env.APPCENTER

  t.end()
})

function assertVendorConstants (expect, ci, t) {
  ci._vendors.forEach(function (constant) {
    let bool = constant === expect
    bool = (expect === 'SOLANO' && constant === 'TDDIUM') || bool // support deprecated option
    t.equal(ci[constant], bool, 'ci.' + constant)
  })
}
