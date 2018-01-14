const { STRING, BOOLEAN, ENUM, INTEGER, UUID, UUIDV4 } = require('sequelize')
const sequelize = require('./sequelize')
const bcrypt = require('bcryptjs')

const SHIRT_SIZES = ['none', 'fxs', 'fs', 'fm', 'fl', 'fxl', 'mxs', 'ms', 'mm', 'ml', 'mxl']

const User = sequelize.define('user', {
  id: { primaryKey: true, type: UUID, defaultValue: UUIDV4 },
  name: { type: STRING, unique: true },
  email: { type: STRING, validate: { isEmail: true }, unique: true },
  isAdmin: { type: BOOLEAN, defaultValue: false },
  password: { type: STRING },
  barcode: { type: STRING },
  paid: { type: BOOLEAN, defaultValue: false },
  shirt: { type: ENUM(...SHIRT_SIZES), defaultValue: 'none' },
  plusone: { type: BOOLEAN, defaultValue: false },
  ethernet: { type: BOOLEAN, defaultValue: false },
  transactionId: { type: INTEGER, defaultValue: 0 },
  transactionState: { type: STRING }
})

User.prototype.validatePassword = function (pwd) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, this.password, (err, res) => {
      if (err) { return reject(err) }

      resolve(res)
    })
  })
}

User.prototype.isCaptain = function (team) {
  return team.captainId === this.id
}

const Team = sequelize.define('team', {
  name: { type: STRING, unique: true },
  captainId: { type: UUID },
  soloTeam: { type: BOOLEAN, defaultValue: false }
})

const Spotlight = sequelize.define('spotlight', {
  name: { type: STRING, unique: true },
  maxPlayers: { type: INTEGER },
  perTeam: { type: INTEGER, defaultValue: 5 }
})

const Teamfinder = sequelize.define('teamfinder', {
  lookingFor: { type: STRING }
})

const AskingUsers = sequelize.define('askingUsers', {
  message: { type: STRING }
})

User.belongsTo(Team)
Team.hasMany(User)

User.belongsToMany(Team, { through: AskingUsers, as: 'RequestedTeam' })
Team.belongsToMany(User, { through: AskingUsers, as: 'AskingUser' })

Team.belongsTo(Spotlight)
Spotlight.hasMany(Team)

Teamfinder.belongsTo(Team)
Team.hasMany(Teamfinder)

module.exports = { User, Team, Spotlight, Teamfinder, AskingUsers }
