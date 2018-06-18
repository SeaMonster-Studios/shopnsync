#!/usr/bin/env node
const program = require('commander')
const childProcess = require('child_process')
const colors = require('colors')
const zip = require('zip-dir')
//
const setupUser = require('./utils/setupUser')

async function init() {
  program
    .version('1.0.0-alpha', '-v, --version')
    .option(
      'init',
      'Copy extendable config files: webpack, package.json, config.yml, etc.',
    )
    .option('start', 'Start shopnsync development server.')
    .option(
      'build',
      'Produce bundle for src files, and place them in the `assets/` directory.',
    )
    .option('package', 'Zip theme for uploading to Shopify store.')
    .option('zip', 'alias for pacakge')
    .parse(process.argv)

  if (program.init) {
    try {
      console.log(
        `[${colors.blue(
          'Shopnsync',
        )}] Copying files & installing dependencies...`,
      )
      await setupUser()
      childProcess.exec('npm i', error => {
        if (error)
          console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
      })
    } catch (error) {
      console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
    }
  }
  if (program.start) {
    const start = childProcess.exec('npm run start', error => {
      if (error)
        console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
    })
    start.stdout.on('data', data => console.log(data))
  }
  if (program.build) {
    console.log(`[${colors.blue('Shopnsync')}] Compiling assets...`)

    // Build webpack assets
    const build = childProcess.exec('npm run build', error => {
      error
        ? console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
        : console.log(
            `[${colors.blue('Shopnsync')}] ${colors.black(
              colors.green('Asset compilation successful.'),
            )}`,
          )
      // upload new files
      console.log(
        `[${colors.blue('Shopnsync')}] Uploading changes to Shopify...`,
      )
      const upload = childProcess.exec('theme upload', error => {
        error
          ? console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
          : console.log(
              `[${colors.blue('Shopnsync')}] ${colors.black(
                colors.green(
                  'Assets and other changed files successfully uploaded to Shopify.',
                ),
              )}`,
            )
      })
      upload.stdout.on('data', data => console.log(data))
    })
    build.stdout.on('data', data => console.log(data))
  }
  if (program.package || program.zip) {
    console.log(`[${colors.blue('Shopnsync')}] Packaging theme...`)
    zip(
      process.cwd(),
      {
        filter: path => !/\.zip$|node_modules/.test(path),
        saveTo: `${process.cwd()}/theme.zip`,
      },
      error => {
        error
          ? console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
          : console.log(
              `[${colors.blue('Shopnsync')}] ${colors.black(
                colors.green('Theme package successful.'),
              )}`,
            )
      },
    )
  }
}

init().catch(error => {
  console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
})
