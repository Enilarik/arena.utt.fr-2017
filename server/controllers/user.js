const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const { Team, User, Teamfinder, AskingUsers, Spotlight } = require('../database')
const isAuth = require('../lib/isAuth')
const log = require('../lib/log')
const publicUserFields = require('../lib/publicUserFields')
const { isSpotlightFull } = require('../lib/isFull')
const config = require('../config')

/**
 * GET /user
 *
 * Success response:
 * {
 *   user: User,
 *   token: String,
 *   tournaments: Array<Spotlight>
 *   teams: Array<Team>
 *   teamfinders: Array<Teamfinder>
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of []
 */
module.exports = (app) => {
  app
    .get('/user', isAuth, async (req, res) => {
      try {
        const teamfinders = await Teamfinder.findAll({
          include: [
            { model: Team }
          ]
        })

        let spotlights = await Spotlight.findAll({
          include: [
            {
              model: Team,
              include: [ User ]
            }
          ]
        })

        let teams = await Team.findAll({
          include: [
            { model: User, through: AskingUsers, as: 'AskingUser' }
          ]
        })

        // clean teams
        teams = teams.map((team) => {
          team = team.toJSON()

          // AskingUser = users on AskingUsers
          if (team.AskingUser) {
            team.askingUsers = team.AskingUser.map((teamUser) => {
              // Clean the user
              const cleanedUser = pick(teamUser, publicUserFields)

              // Add data from join table
              cleanedUser.askingMessage = teamUser.askingUsers.message

              return cleanedUser
            })

            delete team.AskingUser
          }

          return team
        })

        spotlights = spotlights.map((spotlight) => {
          spotlight = spotlight.toJSON()

          spotlight.isFull = isSpotlightFull(spotlight, true)
        })

        // Generate new token
        const token = jwt.sign({ id: req.user.id }, config.app.secret, { expiresIn: '2 hours' })

        const user = req.user.toJSON()

        // clean user team
        if (user.team && user.team.users.length > 0) {
          user.team.users = user.team.users.map(teamUser => pick(teamUser, publicUserFields))
        }

        res
          .status(200)
          .json({
            user: pick(user, publicUserFields),
            token,
            tournaments: config.tournaments,
            teams,
            teamfinders
          })
          .end()
      } catch (err) {
        log.error('[user] failed', err)


        return res
          .status(500)
          .json({ error: 'UNKNOWN' })
          .end()
      }
    })
}
