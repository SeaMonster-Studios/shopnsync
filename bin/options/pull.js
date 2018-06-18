const colors = require('colors')
const childProcess = require('child_process')

module.exports = async function() {
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
