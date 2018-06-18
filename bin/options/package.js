const colors = require('colors')
const zip = require('zip-dir')

module.exports = async function() {
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
