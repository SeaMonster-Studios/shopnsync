const colors = require('colors')
const childProcess = require('child_process')

module.exports = async function() {
  console.log(
    `[${colors.blue(
      'Shopnsync',
    )}] Pushing theme changes from Shopify Store (this may take a few minutes)...`,
  )
  const push = childProcess.exec('theme replace', error => {
    error
      ? console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
      : console.log(
          `[${colors.blue('Shopnsync')}] ${colors.black(
            colors.green(
              'Successfully pushed theme changes from Shopify Store',
            ),
          )}`,
        )
  })

  let prevData = ''
  push.stdout.on('data', data => {
    if (data !== prevData) {
      prevData = data
      console.log(data)
    }
  })
}
