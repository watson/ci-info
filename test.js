'use strict'

var assert = require('assert')
var clearRequire = require('clear-require')

// Known CI
process.env.TRAVIS = 'true'
var ci = require('./')

assert(Array.isArray(ci._vendors))
assert(ci._vendors.length > 0)

assert.strictEqual(ci.isCI, true)
assert.strictEqual(ci.name, 'Travis CI')
assert.strictEqual(ci.TRAVIS, true)
assertVendorConstants(true)

// Not CI
delete process.env.CI
delete process.env.CONTINUOUS_INTEGRATION
delete process.env.BUILD_NUMBER
delete process.env.TRAVIS
clearRequire('./')
ci = require('./')

assert.strictEqual(ci.isCI, false)
assert.strictEqual(ci.name, null)
assert.strictEqual(ci.TRAVIS, false)
assertVendorConstants(false)

// Unknown CI
process.env.CI = 'true'
clearRequire('./')
ci = require('./')

assert.strictEqual(ci.isCI, true)
assert.strictEqual(ci.name, null)
assert.strictEqual(ci.TRAVIS, false)
assertVendorConstants(false)

function assertVendorConstants () {
  ci._vendors.forEach(function (constant) {
    if (constant === 'TRAVIS') return
    assert.strictEqual(ci[constant], false)
  })
}
