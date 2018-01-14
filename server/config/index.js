const fs = require('fs')
const path = require('path')

let config
try {
  config = require('./config.json')
} catch (err) {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json.example'), 'utf8'))
}

const exists = o => Boolean(o)

function getFromEnv (tree, prefix = '') {
  Object.keys(tree).forEach((key) => {
    const envKey = [ prefix, key.toUpperCase() ].filter(exists).join('_')

    if (typeof tree[key] === 'object') {
      getFromEnv(tree[key], envKey)
    } else {
      if (process.env[envKey]) {
        if (typeof tree[key] === 'number') {
          tree[key] = parseInt(process.env[envKey], 10)
        } else if (typeof tree[key] === 'boolean') {
          tree[key] = process.env[envKey] === 'true'
        } else {
          tree[key] = process.env[envKey]
        }
      }
    }
  })
}

getFromEnv(config, '')

console.log(config);

module.exports = config
