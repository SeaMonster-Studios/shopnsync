const colors = require('colors')
const childProcess = require('child_process')
//
const setupUser = require('../utils/setupUser')

module.exports = async function() {
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
