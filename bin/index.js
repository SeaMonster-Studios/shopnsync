#!/usr/bin/env node
const program = require('commander')
const colors = require('colors')
//
const build = require('./options/build')
const init = require('./options/init')
const packageOption = require('./options/package')
const pullForce = require('./options/pull:force')
const pull = require('./options/pull')
const start = require('./options/start')

async function initSns() {
  program
    .version('1.0.0-alpha', '-v, --version')
    .option(
      'init',
      'Copy extendable config files: webpack, package.json, config.yml, etc.',
    )
    .option('start', 'Start shopnsync development server.')
    .option(
      'build',
      'Bundles your assets and places them in the `assets` directory of your theme. It also uploads all file changes to Shopify.',
    )
    .option(
      'pull',
      "An alias for themekit's `theme download`. Pull changes from Shopify store. This can overwrite any local files that have an older timestamp that what is in the Shopify store.",
    )
    .option(
      'pull:force',
      "An alias for themekit's `theme download --force`. Completely overwrites any local files with what is on the Shopify store, regardless of timestamp.",
    )
    .option('package', 'Zip theme for uploading to Shopify store.')
    .option('zip', 'alias for pacakge')
    .parse(process.argv)

  if (program.init) {
    init()
  }
  if (program.start) {
    start()
  }
  if (program.build) {
    build()
  }
  if (program.pull) {
    pull()
  }
  if (program['pull:force']) {
    pullForce()
  }
  if (program.package || program.zip) {
    packageOption()
  }
}

initSns().catch(error => {
  console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
})
