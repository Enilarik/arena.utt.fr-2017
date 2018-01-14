const models = require('./models')

module.exports = {
  sequelize: require('./sequelize'),
  seed: require('./seed'),
  User: models.User,
  Team: models.Team,
  Spotlight: models.Spotlight,
  Teamfinder: models.Teamfinder,
  AskingUsers: models.AskingUsers
}
