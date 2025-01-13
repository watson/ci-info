'use strict'

const test = require('tape')
const clearModule = require('clear-module')

const isActualPR = process.env.GITHUB_EVENT_NAME === 'pull_request'

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
  const envVars = [
    'CI',
    'CONTINUOUS_INTEGRATION',
    'BUILD_NUMBER',
    'TRAVIS',
    'GITHUB_ACTIONS'
  ]

  envVars.forEach((envVar) => delete process.env[envVar])
  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, false)
  t.equal(ci.isPR, null)
  t.equal(ci.name, null)
  t.equal(ci.id, null)
  t.equal(ci.TRAVIS, false)
  assertVendorConstants(null, ci, t)

  t.end()
})

test('Bypass isCI checks with CI set to `false`', function (t) {
  process.env.CI = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, false)

  t.end()
})

test('Unknown CI', function (t) {
  process.env.CI = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, null)
  t.equal(ci.name, null)
  t.equal(ci.id, null)
  t.equal(ci.TRAVIS, false)
  assertVendorConstants(null, ci, t)

  t.end()
})

test('Anonymous CI', function (t) {
  const ANONYMOUS_ENV_VARS = [
    'CI',
    'CONTINUOUS_INTEGRATION',
    'BUILD_ID',
    'BUILD_NUMBER',
    'CI_APP_ID',
    'CI_BUILD_ID',
    'CI_BUILD_NUMBER',
    'RUN_ID',
    'CI_NAME'
  ]

  ANONYMOUS_ENV_VARS.forEach((envVar) => {
    process.env[envVar] = true

    clearModule('./')
    const ci = require('./')
    t.equal(ci.isCI, true)
    t.equal(ci.isPR, null)
    t.equal(ci.name, null)
    t.equal(ci.id, null)
  })

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
  t.equal(ci.id, 'APPVEYOR')
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
  t.equal(ci.id, 'APPVEYOR')
  assertVendorConstants('APPVEYOR', ci, t)

  delete process.env.APPVEYOR

  t.end()
})

test('Azure Pipelines - PR', function (t) {
  process.env.TF_BUILD = 'true'
  process.env.BUILD_REASON = 'PullRequest'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Azure Pipelines')
  t.equal(ci.AZURE_PIPELINES, true)
  t.equal(ci.id, 'AZURE_PIPELINES')
  assertVendorConstants('AZURE_PIPELINES', ci, t)

  delete process.env.TF_BUILD
  delete process.env.BUILD_REASON

  t.end()
})

test('Azure Pipelines - Not PR', function (t) {
  process.env.TF_BUILD = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Azure Pipelines')
  t.equal(ci.AZURE_PIPELINES, true)
  t.equal(ci.id, 'AZURE_PIPELINES')
  assertVendorConstants('AZURE_PIPELINES', ci, t)

  delete process.env.TF_BUILD

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
  t.equal(ci.id, 'BITBUCKET')
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
  t.equal(ci.id, 'BITBUCKET')
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
  t.equal(ci.id, 'BUILDKITE')
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
  t.equal(ci.id, 'BUILDKITE')
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
  t.equal(ci.id, 'CIRCLE')
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
  t.equal(ci.id, 'CIRCLE')
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
  t.equal(ci.id, 'CIRRUS')
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
  t.equal(ci.id, 'CIRRUS')
  assertVendorConstants('CIRRUS', ci, t)

  delete process.env.CIRRUS_CI

  t.end()
})

test('Cloudflare Pages - Not PR', function (t) {
  // https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
  process.env.CF_PAGES = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, null)
  t.equal(ci.name, 'Cloudflare Pages')
  t.equal(ci.CLOUDFLARE_PAGES, true)
  t.equal(ci.id, 'CLOUDFLARE_PAGES')
  assertVendorConstants('CLOUDFLARE_PAGES', ci, t)

  delete process.env.CF_PAGES

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
  t.equal(ci.id, 'CODEFRESH')
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
  t.equal(ci.id, 'CODEFRESH')
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
  t.equal(ci.id, 'LAYERCI')
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
  t.equal(ci.id, 'LAYERCI')
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
  t.equal(ci.id, 'APPCIRCLE')
  assertVendorConstants('APPCIRCLE', ci, t)

  delete process.env.AC_APPCIRCLE

  t.end()
})

test('Appcircle - PR', function (t) {
  process.env.AC_APPCIRCLE = 'true'
  process.env.AC_GIT_PR = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Appcircle')
  t.equal(ci.APPCIRCLE, true)
  t.equal(ci.id, 'APPCIRCLE')
  assertVendorConstants('APPCIRCLE', ci, t)

  delete process.env.AC_APPCIRCLE
  delete process.env.AC_GIT_PR

  t.end()
})

test('Appcircle - Not PR', function (t) {
  process.env.AC_APPCIRCLE = 'true'
  process.env.AC_GIT_PR = 'false'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Appcircle')
  t.equal(ci.APPCIRCLE, true)
  t.equal(ci.id, 'APPCIRCLE')
  assertVendorConstants('APPCIRCLE', ci, t)

  delete process.env.AC_APPCIRCLE
  delete process.env.AC_GIT_PR

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
  t.equal(ci.id, 'RENDER')
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
  t.equal(ci.id, 'RENDER')
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
  t.equal(ci.id, 'SEMAPHORE')
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
  t.equal(ci.id, 'SEMAPHORE')
  assertVendorConstants('SEMAPHORE', ci, t)

  delete process.env.SEMAPHORE

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
  t.equal(ci.id, 'TRAVIS')
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
  t.equal(ci.id, 'TRAVIS')
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
  t.equal(ci.id, 'NETLIFY')
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
  t.equal(ci.id, 'NETLIFY')
  assertVendorConstants('NETLIFY', ci, t)

  delete process.env.NETLIFY
  delete process.env.PULL_REQUEST

  t.end()
})

test('Vercel - NOW_BUILDER', function (t) {
  process.env.NOW_BUILDER = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Vercel')
  t.equal(ci.VERCEL, true)
  t.equal(ci.id, 'VERCEL')
  assertVendorConstants('VERCEL', ci, t)

  delete process.env.NOW_BUILDER

  t.end()
})

test('Vercel - VERCEL', function (t) {
  process.env.VERCEL = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Vercel')
  t.equal(ci.VERCEL, true)
  t.equal(ci.id, 'VERCEL')
  assertVendorConstants('VERCEL', ci, t)

  delete process.env.VERCEL

  t.end()
})

test('Vercel - PR', function (t) {
  process.env.VERCEL = '1'
  process.env.VERCEL_GIT_PULL_REQUEST_ID = '23'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Vercel')
  t.equal(ci.VERCEL, true)
  t.equal(ci.id, 'VERCEL')
  assertVendorConstants('VERCEL', ci, t)

  delete process.env.VERCEL

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
  t.equal(ci.id, 'NEVERCODE')
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
  t.equal(ci.id, 'NEVERCODE')
  assertVendorConstants('NEVERCODE', ci, t)

  delete process.env.NEVERCODE
  delete process.env.NEVERCODE_PULL_REQUEST

  t.end()
})

test('Expo Application Services', function (t) {
  process.env.EAS_BUILD = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, null)
  t.equal(ci.name, 'Expo Application Services')
  t.equal(ci.EAS, true)
  t.equal(ci.id, 'EAS')
  assertVendorConstants('EAS', ci, t)

  delete process.env.EAS_BUILD

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
  t.equal(ci.id, 'GITHUB_ACTIONS')
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
  t.equal(ci.id, 'GITHUB_ACTIONS')
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
  t.equal(ci.id, 'SCREWDRIVER')
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
  t.equal(ci.id, 'SCREWDRIVER')
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
  t.equal(ci.isPR, null)
  t.equal(ci.name, 'Visual Studio App Center')
  t.equal(ci.APPCENTER, true)
  t.equal(ci.id, 'APPCENTER')
  assertVendorConstants('APPCENTER', ci, t)

  delete process.env.APPCENTER_BUILD_ID

  t.end()
})

test('Codemagic - PR', function (t) {
  process.env.CM_BUILD_ID = '1'
  process.env.CM_PULL_REQUEST = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Codemagic')
  t.equal(ci.CODEMAGIC, true)
  t.equal(ci.id, 'CODEMAGIC')
  assertVendorConstants('CODEMAGIC', ci, t)

  delete process.env.CM_BUILD_ID
  delete process.env.CM_PULL_REQUEST

  t.end()
})

test('Codemagic - Not PR', function (t) {
  process.env.CM_BUILD_ID = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Codemagic')
  t.equal(ci.CODEMAGIC, true)
  t.equal(ci.id, 'CODEMAGIC')
  assertVendorConstants('CODEMAGIC', ci, t)

  delete process.env.CM_BUILD_ID

  t.end()
})

test('Xcode Cloud - PR', function (t) {
  process.env.CI_XCODE_PROJECT = 'xx'
  process.env.CI_PULL_REQUEST_NUMBER = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Xcode Cloud')
  t.equal(ci.XCODE_CLOUD, true)
  t.equal(ci.id, 'XCODE_CLOUD')
  assertVendorConstants('XCODE_CLOUD', ci, t)

  delete process.env.CI_XCODE_PROJECT
  delete process.env.CI_PULL_REQUEST_NUMBER

  t.end()
})

test('Xcode Cloud - Not PR', function (t) {
  process.env.CI_XCODE_PROJECT = 'xx'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Xcode Cloud')
  t.equal(ci.XCODE_CLOUD, true)
  t.equal(ci.id, 'XCODE_CLOUD')
  assertVendorConstants('XCODE_CLOUD', ci, t)

  delete process.env.CI_XCODE_PROJECT

  t.end()
})

test('Xcode Server - Not PR', function (t) {
  process.env.XCS = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, null)
  t.equal(ci.name, 'Xcode Server')
  t.equal(ci.XCODE_SERVER, true)
  t.equal(ci.id, 'XCODE_SERVER')
  assertVendorConstants('XCODE_SERVER', ci, t)

  delete process.env.XCS

  t.end()
})

test('Heroku', function (t) {
  const realNode = process.env.NODE
  process.env.NODE = '/extra/content/app/.heroku/node/bin/node --extra --content'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Heroku')
  t.equal(ci.HEROKU, true)
  t.equal(ci.id, 'HEROKU')
  assertVendorConstants('HEROKU', ci, t)

  process.env.NODE = realNode
  t.end()
})

test('Sourcehit', function (t) {
  process.env.CI_NAME = 'sourcehut'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Sourcehut')
  t.equal(ci.SOURCEHUT, true)
  t.equal(ci.id, 'SOURCEHUT')
  assertVendorConstants('SOURCEHUT', ci, t)

  delete process.env.CI_NAME

  t.end()
})

test('ReleaseHub', function (t) {
  process.env.RELEASE_BUILD_ID = '1a'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'ReleaseHub')
  t.equal(ci.RELEASEHUB, true)
  t.equal(ci.id, 'RELEASEHUB')
  assertVendorConstants('RELEASEHUB', ci, t)

  delete process.env.RELEASE_BUILD_ID

  t.end()
})

test('Gitea Actions', function (t) {
  process.env.GITEA_ACTIONS = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Gitea Actions')
  t.equal(ci.GITEA_ACTIONS, true)
  t.equal(ci.id, 'GITEA_ACTIONS')
  assertVendorConstants('GITEA_ACTIONS', ci, t)

  delete process.env.GITEA_ACTIONS

  t.end()
})

test('Agola CI', function (t) {
  process.env.AGOLA_GIT_REF = 'true'
  process.env.AGOLA_PULL_REQUEST_ID = ''

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Agola CI')
  t.equal(ci.AGOLA, true)
  t.equal(ci.id, 'AGOLA')
  assertVendorConstants('AGOLA', ci, t)

  delete process.env.AGOLA_GIT_REF
  delete process.env.AGOLA_PULL_REQUEST_ID

  t.end()
})

test('Agola CI - PR', function (t) {
  process.env.AGOLA_GIT_REF = 'true'
  process.env.AGOLA_PULL_REQUEST_ID = '12'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Agola CI')
  t.equal(ci.AGOLA, true)
  t.equal(ci.id, 'AGOLA')
  assertVendorConstants('AGOLA', ci, t)

  delete process.env.AGOLA_GIT_REF
  delete process.env.AGOLA_PULL_REQUEST_ID

  t.end()
})

test('Vela', function (t) {
  process.env.VELA = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, false)
  t.equal(ci.name, 'Vela')
  t.equal(ci.VELA, true)
  t.equal(ci.id, 'VELA')
  assertVendorConstants('VELA', ci, t)

  delete process.env.VELA

  t.end()
})

test('Vela - PR', function (t) {
  process.env.VELA = 'true'
  process.env.VELA_PULL_REQUEST = '1'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'Vela')
  t.equal(ci.VELA, true)
  t.equal(ci.id, 'VELA')
  assertVendorConstants('VELA', ci, t)

  delete process.env.VELA
  delete process.env.VELA_PULL_REQUEST

  t.end()
})

test('Prow', function (t) {
  process.env.PROW_JOB_ID = '123'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Prow')
  t.equal(ci.PROW, true)
  t.equal(ci.id, 'PROW')
  assertVendorConstants('PROW', ci, t)

  delete process.env.PROW_JOB_ID

  t.end()
})

test('Earthly CI', function (t) {
  process.env.EARTHLY_CI = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Earthly')
  t.equal(ci.EARTHLY, true)
  t.equal(ci.id, 'EARTHLY')
  assertVendorConstants('EARTHLY', ci, t)

  delete process.env.EARTHLY_CI

  t.end()
})

test('AWS Codebuild', function (t) {
  process.env.CODEBUILD_BUILD_ARN = 'true'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'AWS CodeBuild')
  t.equal(ci.CODEBUILD, true)
  t.equal(ci.id, 'CODEBUILD')
  assertVendorConstants('CODEBUILD', ci, t)

  delete process.env.CODEBUILD_BUILD_ARN

  t.end()
})

test('AWS Codebuild - PR', function (t) {
  process.env.CODEBUILD_BUILD_ARN = 'true'
  process.env.CODEBUILD_WEBHOOK_EVENT = 'PULL_REQUEST_CREATED'

  clearModule('./')
  const ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.isPR, true)
  t.equal(ci.name, 'AWS CodeBuild')
  t.equal(ci.CODEBUILD, true)
  t.equal(ci.id, 'CODEBUILD')
  assertVendorConstants('CODEBUILD', ci, t)

  delete process.env.CODEBUILD_BUILD_ARN
  delete process.env.CODEBUILD_WEBHOOK_EVENT

  t.end()
})

function assertVendorConstants (expect, ci, t) {
  ci._vendors.forEach(function (constant) {
    const bool = constant === expect
    t.equal(ci[constant], bool, 'ci.' + constant)
  })
}
