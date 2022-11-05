const { stdin , stdout } = process
const path = require('path')
const fs = require('fs')
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'))

stdout.write('Hello, please enter the text to add\n')

stdin.on('data', data => {
    const dataNoWhiteSpaces = data.toString().trim()
    if(dataNoWhiteSpaces === 'exit') exitProcess()

    output.write(data)
})

process.on('SIGINT', exitProcess)

function exitProcess() {
    stdout.write('Goodbye!')
    process.exit()
}