let buildMode = process.argv[2] || 'build',
  flespiMode = process.argv[3] || 'production'

let shell = require('shelljs')

process.env.FLESPI_MODE = flespiMode

console.log('FLESPI_MODE is ' + flespiMode)

shell.exec('quasar ' + buildMode)
