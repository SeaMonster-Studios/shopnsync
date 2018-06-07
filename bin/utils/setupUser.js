const fs = require('fs')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)

async function setupUser() {
  const snsDir = `${__dirname}/../user-files`
  const userDir = process.cwd()
  const userFiles = await readdir(userDir)
  const snsUserFiles = await readdir(snsDir)

  console.log(snsUserFiles)

  for (let snsFile of snsUserFiles) {
    const found = userFiles.some(userFile => userFile === snsFile)

    if (!found) {
      fs.createReadStream(`${snsDir}/${snsFile}`).pipe(
        fs.createWriteStream(`${userDir}/${snsFile}`),
      )
    }
  }

  // const srcDir = await readdir(`${process.cwd()}/src`)
  return
}

module.exports = setupUser
