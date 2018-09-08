'use strict'

var vendors = require('./vendors')

var env = process.env

// Used for testinging only
Object.defineProperty(exports, '_vendors', {
  value: vendors.map(function (v) { return v.constant })
})

exports.name = null

vendors.forEach(function (vendor) {
  var envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env]
  var isCI = envs.every(function (obj) {
    if (typeof obj === 'string') return !!env[obj]
    return Object.keys(obj).every(function (k) {
      return env[k] === obj[k]
    })
  })
  exports[vendor.constant] = isCI
  if (isCI) exports.name = vendor.name
})

exports.isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  exports.name ||
  false
)
