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
    console.log(
      `[${colors.blue(
        'Shopnsync',
      )}] Starting Webpack and Browsersync servers...`,
    )
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
  if (program.pull) {
    console.log(
      `[${colors.blue(
        'Shopnsync',
      )}] Pulling theme changes from Shopify Store (this may take a few minutes)...`,
    )
    const pull = childProcess.exec('theme download', error => {
      error
        ? console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
        : console.log(
            `[${colors.blue('Shopnsync')}] ${colors.black(
              colors.green(
                'Successfully pulled theme changes from Shopify Store',
              ),
            )}`,
          )
    })

    let prevData = ''
    pull.stdout.on('data', data => {
      if (data !== prevData) {
        prevData = data
        console.log(data)
      }
    })
  }
  if (program['pull:force']) {
    console.log(
      `[${colors.blue(
        'Shopnsync',
      )}] Pulling theme changes from Shopify Store (this may take a few minutes)...`,
    )
    const pull = childProcess.exec('theme download --force', error => {
      error
        ? console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
        : console.log(
            `[${colors.blue('Shopnsync')}] ${colors.black(
              colors.green(
                'Successfully pulled theme changes from Shopify Store',
              ),
            )}`,
          )
    })

    let prevData = ''
    pull.stdout.on('data', data => {
      if (data !== prevData) {
        prevData = data
        console.log(data)
      }
    })
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
