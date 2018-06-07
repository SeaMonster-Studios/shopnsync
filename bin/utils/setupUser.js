const fs = require('fs-extra')

async function setupUser() {
  const snsDir = `${__dirname}/../user-files`
  const userDir = process.cwd()
  const userFiles = await fs.readdir(userDir)
  const snsUserFiles = await fs.readdir(snsDir)

  for (let snsFile of snsUserFiles) {
    const found = userFiles.some(userFile => userFile === snsFile)

    if (!found) {
      await fs.copy(`${snsDir}/${snsFile}`, `${userDir}/${snsFile}`)
    }
  }
  return
}

module.exports = setupUser
