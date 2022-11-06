const { mkdir, copyFile, readdir, rm } = require('fs/promises')
const path = require('path')
const filesCopyPath = path.join(__dirname, 'files-copy')
const filesPath = path.join(__dirname, 'files')

async function createCopyDirectory() {
    try {
        await mkdir(filesCopyPath, {recursive: true})
        await clearCopyDirectory()

        const files = await readdir(filesPath)

        for(let file of files) {
            await copyFile(path.join(filesPath, file), path.join(filesCopyPath, file))
        }

    } catch(err) {
        console.error(err)
    }
}

async function clearCopyDirectory() {
    const filesInCopyDir = await readdir(filesCopyPath)

    for(let file of filesInCopyDir) {
        await rm(path.join(filesCopyPath, file), {force: true})
    }
}

createCopyDirectory()