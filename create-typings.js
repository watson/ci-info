'use strict'

const fs = require('fs')
const vendors = require('./vendors.json')

function createTypings () {
  let typings = `// This file is generated at pre-commit by running \`node create-typings.js\`.

/**
 * Returns a boolean. Will be \`true\` if the code is running on a CI server,
 * otherwise \`false\`.
 *
 * Some CI servers not listed here might still trigger the \`ci.isCI\`
 * boolean to be set to \`true\` if they use certain vendor neutral environment
 * variables. In those cases \`ci.name\` will be \`null\` and no vendor specific
 * boolean will be set to \`true\`.
 */
export const isCI: boolean;
/**
 * Returns a boolean if PR detection is supported for the current CI server.
 * Will be \`true\` if a PR is being tested, otherwise \`false\`. If PR detection is
 * not supported for the current CI server, the value will be \`null\`.
 */
export const isPR: boolean | null;
/**
 * Returns a string containing name of the CI server the code is running on. If
 * CI server is not detected, it returns \`null\`.
 *
 * Don't depend on the value of this string not to change for a specific vendor.
 * If you find your self writing \`ci.name === 'Travis CI'\`, you most likely want
 * to use \`ci.TRAVIS\` instead.
 */
export const name: string | null;

`

  for (const { constant } of vendors) {
    typings += `export const ${constant}: boolean;`
    typings += '\n'
  }

  return typings
}

fs.writeFileSync('./index.d.ts', createTypings())
