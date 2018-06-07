#!/usr/bin/env node
const program = require('commander')
//
const setupUser = require('./utils/setupUser')

program
  .version('1.0.0-alpha', '-v, --version')
  .option(
    'init',
    'Copy extendable config files: yml, eslint, babel, flow, and src directory with index.js file.',
  )
  .option('start', 'Start shopnsync development server.')
  .option(
    'build',
    'Produce bundle for src files, and place them in the `assets/` directory.',
  )
  .option('package', 'Zip theme for uploading to Shopify store.')
  .parse(process.argv)

const init = async () => {
  if (program.init) {
    await setupUser()
  }
  if (program.start) {
    console.log('starting...')
  }
  if (program.build) console.log('building')
  if (program.package) console.log('packagin')
}

init()
