const childProcess = require('child_process')
const colors = require('colors')

module.exports = async function() {
  console.log(
    `[${colors.blue('Shopnsync')}] Starting Webpack and Browsersync servers...`,
  )
  const start = childProcess.exec('npm run start', error => {
    if (error)
      console.error(`[${colors.blue('Shopnsync')}] ${colors.red(error)}`)
  })
  let prevData = ''
  start.stdout.on('data', data => {
    if (data !== prevData) {
      prevData = data
      console.log(data)
    }
  })
}
