const leftPad = require('left-pad')
const winston = require('winston')

const config = require('../config')

// Pad2
const p2 = n => leftPad(n, 2, 0)

function timestamp () {
  const now = new Date()
  const date = `${p2(now.getFullYear())}/${p2(now.getMonth())}/${p2(now.getDate())}`
  const time = `${p2(now.getHours())}:${p2(now.getMinutes())}:${p2(now.getSeconds())}`

  return `[${date} ${time}]`
}

const log = new winston.Logger({ transports: [] })

if (config.log.console !== 'none') {
  log.add(winston.transports.Console, {
    timestamp,
    level: config.log.console,
    name: 'console',
    prettyPrint: true,
    colorize: true
  })
}

if (config.log.file !== 'none') {
  log.add(winston.transports.File, {
    timestamp,
    name: 'file',
    level: config.log.file,
    filename: 'log.out',
    maxsize: config.log.maxsize,
    prettyPrint: false,
    colorize: false
  })

  log.add(winston.transports.File, {
    timestamp,
    name: 'file-debug',
    level: 'debug',
    filename: 'log.debug.out',
    maxsize: config.log.maxsize,
    prettyPrint: false,
    colorize: false
  })
}

module.exports = log
