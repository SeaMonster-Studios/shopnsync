const colors = require('colors')
const childProcess = require('child_process')

module.exports = async function() {
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
    console.log(`[${colors.blue('Shopnsync')}] Uploading changes to Shopify...`)
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
    let prevUploadData = ''
    upload.stdout.on('data', data => {
      if (data !== prevUploadData) {
        prevUploadData = data
        console.log(data)
      }
    })
  })
  let prevBuildData = ''
  build.stdout.on('data', data => {
    if (data !== prevBuildData) {
      prevBuildData = data
      console.log(data)
    }
  })
}
