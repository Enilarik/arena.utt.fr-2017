const Sequelize = require('sequelize')
const config = require('../config')
const log = require('../lib/log')

module.exports = new Sequelize(config.db.name, config.db.user, config.db.pwd, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: query => {
    log.debug(query)
  }
})
