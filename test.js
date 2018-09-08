'use strict'

var test = require('tape')
var clearRequire = require('clear-require')

test('Known CI', function (t) {
  process.env.TRAVIS = 'true'

  var ci = require('./')

  t.ok(Array.isArray(ci._vendors))
  t.ok(ci._vendors.length > 0)

  t.equal(ci.isCI, true)
  t.equal(ci.name, 'Travis CI')
  t.equal(ci.TRAVIS, true)
  assertVendorConstants(ci, t)

  t.end()
})

test('Not CI', function (t) {
  delete process.env.CI
  delete process.env.CONTINUOUS_INTEGRATION
  delete process.env.BUILD_NUMBER
  delete process.env.TRAVIS

  clearRequire('./')
  var ci = require('./')

  t.equal(ci.isCI, false)
  t.equal(ci.name, null)
  t.equal(ci.TRAVIS, false)
  assertVendorConstants(ci, t)

  t.end()
})

test('Unknown CI', function (t) {
  process.env.CI = 'true'

  clearRequire('./')
  var ci = require('./')

  t.equal(ci.isCI, true)
  t.equal(ci.name, null)
  t.equal(ci.TRAVIS, false)
  assertVendorConstants(ci, t)

  t.end()
})

function assertVendorConstants (ci, t) {
  ci._vendors.forEach(function (constant) {
    if (constant === 'TRAVIS') return
    t.equal(ci[constant], false)
  })
}
