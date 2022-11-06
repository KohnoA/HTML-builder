const path = require('path')
const { readdir, readFile, appendFile, rm } = require('fs/promises')
const distDirPath = path.join(__dirname, 'project-dist')
const styleDirPath = path.join(__dirname, 'styles')

async function createBundle() {
    try {
        await rm(path.join(distDirPath, 'bundle.css'), {force: true})
        const styleDir = await readdir(styleDirPath, {withFileTypes: true})
    
        for(let file of styleDir) {
            const fileExt = path.extname(file.name)
    
            if(file.isFile() && fileExt === '.css') {
                const insides = await readFile(path.join(styleDirPath, file.name), 'utf-8')
                await appendFile(path.join(distDirPath, 'bundle.css'), insides + '\n')
            }
        }

    } catch(err) {
        console.error(err)
    }
}

createBundle()