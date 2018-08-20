'use strict'

var assert = require('assert')
var clearRequire = require('clear-require')

// Known CI
process.env.TRAVIS = 'true'
var ci = require('./')

assert(Array.isArray(ci._vendors))
assert(ci._vendors.length > 0)

assert.equal(ci.isCI, true)
assert.equal(ci.name, 'Travis CI')
assert.equal(ci.TRAVIS, true)
assertVendorConstants(true)

// Not CI
delete process.env.CI
delete process.env.CONTINUOUS_INTEGRATION
delete process.env.BUILD_NUMBER
delete process.env.TRAVIS
clearRequire('./')
ci = require('./')

assert.equal(ci.isCI, false)
assert.equal(ci.name, undefined)
assert.equal(ci.TRAVIS, false)
assertVendorConstants(false)

// Unknown CI
process.env.CI = 'true'
clearRequire('./')
ci = require('./')

assert.equal(ci.isCI, true)
assert.equal(ci.name, undefined)
assert.equal(ci.TRAVIS, false)
assertVendorConstants(false)

function assertVendorConstants () {
  ci._vendors.forEach(function (constant) {
    if (constant === 'TRAVIS') return
    assert.equal(ci[constant], false)
  })
}
