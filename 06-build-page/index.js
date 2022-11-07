const path = require('path')
const { readdir, readFile, mkdir, appendFile, rm, copyFile } = require('fs/promises')
const templatePath = path.join(__dirname, 'template.html')
const componentsPath = path.join(__dirname, 'components')
const projectDistPath = path.join(__dirname, 'project-dist')
const styleDirPath = path.join(__dirname, 'styles')
const assetsDirPath = path.join(__dirname, 'assets')

async function buildHTML() {
    try {
        const componentsArr = await readdir(componentsPath)
        let template = await readFile(templatePath, 'utf-8')

        for(let item of componentsArr) {
            const templateTag = `{{${item.slice(0, item.length - 5)}}}`
            const contentTag = await readFile(path.join(componentsPath, item), 'utf-8') 

            template = template.replace(templateTag, contentTag)
        }

        await appendFile(path.join(projectDistPath, 'index.html'), template)

    } catch(err) {
        console.error(err)
    }
}

async function buildStyles() {
    try {
        const styleDir = await readdir(styleDirPath, {withFileTypes: true})
    
        for(let file of styleDir) {
            const fileExt = path.extname(file.name)
    
            if(file.isFile() && fileExt === '.css') {
                const insides = await readFile(path.join(styleDirPath, file.name), 'utf-8')
                await appendFile(path.join(projectDistPath, 'style.css'), insides + '\n')
            }
        }

    } catch(err) {
        console.error(err)
    }
}

async function buildAssets(pathIn, pathOut) {
    try {
        const insides = await readdir(pathIn, {withFileTypes: true})
    
        for(let item of insides) {
            if(item.isFile()) {    
                await copyFile(path.join(pathIn, item.name), path.join(pathOut, item.name))
    
            } else {    
                const pathInRec = path.join(pathIn, item.name)
                const pathOutRec = path.join(pathOut, item.name)
    
                await mkdir(pathOutRec, {recursive: true})
                await buildAssets(pathInRec, pathOutRec)
            }
        }

    } catch(err) {
        console.error(err)
    }
}

async function createBuild() {
    try {
        const assetsDistPath = path.join(projectDistPath, 'assets')
        await rm(projectDistPath, {force: true, recursive: true})

        await mkdir(projectDistPath, {recursive: true})
        await mkdir(assetsDistPath, {recursive: true})
    
        await buildStyles()
        await buildHTML()
        await buildAssets(assetsDirPath, assetsDistPath)

    } catch(err) {
        console.error(err)
    }
}

createBuild()