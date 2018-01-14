const { body } = require('express-validator/check')
const pick = require('lodash.pick')
const { Team, User, AskingUsers, Spotlight } = require('../database')
const validateBody = require('../lib/validateBody')
const isFrenchString = require('../lib/isFrenchString')
const isAuth = require('../lib/isAuth')
const publicUserFields = require('../lib/publicUserFields')
const log = require('../lib/log')

/**
 * POST /joinTeam
 * {
 *   team: Number
 * }
 *
 * team must be numeric
 *
 * Success response:
 * {
 *    team: Team
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_TEAM', 'ERROR_DUPLICATE_JOIN', 'ALREADY_IN_TEAM']
 *
 *
 * POST /cancelJoinTeam
 * {
 *   team: Number
 * }
 *
 * team must be numeric
 *
 * Success response:
 * {
 *    team: Team
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_TEAM']
 */

module.exports = (app) => {
  app.post('/joinTeam', isAuth)

  app.post('/joinTeam', [
    body('team', 'INVALID_TEAM').exists().isNumeric(),
    body('joinTeamFinderMessage', 'INVALID_JOINTEAMFINDERMESSAGE').optional().custom(isFrenchString),
    validateBody('joinTeam')
  ])

  app.post('/cancelJoinTeam', isAuth)

  app.post('/cancelJoinTeam', [
    body('team', 'INVALID_TEAM').exists().isNumeric(),
    validateBody('cancelJoinTeam')
  ])

  app.post('/joinTeam', async (req, res) => {
    if (req.user.team) {
      log.warn(`[joinTeam] user ${req.user.name} tried to join team while he already has one`)

      return res
        .status(401)
        .json({ error: 'ALREADY_IN_TEAM' })
        .end()
    }

    try {
      const team = await Team.findById(req.body.team, { include: [ User, Spotlight ] })

      await team.addAskingUser(req.user, { through: { message: req.body.joinTeamFinderMessage }})

      if (team && team.users.length > 0) {
        team.users = team.users.map(teamUser => pick(teamUser, publicUserFields))
      }

      log.warn(`[joinTeam] user ${req.user.name} joined team ${team.name}`)

      return res
        .status(200)
        .json({ team })
        .end()
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res
          .status(400)
          .json({ error: 'ERROR_DUPLICATE_JOIN' })
          .end()
      }

      log.error('[joinTeam] failed', err)

      return res
        .status(500)
        .json({ error: 'UNKNOWN' })
        .end()
    }
  })

  app.post('/cancelJoinTeam', async (req, res) => {
    try {
      await AskingUsers.destroy({
        where: {
          userId: req.user.id,
          teamId: req.body.team
        }
      })

      res
        .status(200)
        .json({ })
        .end()
    } catch (err) {
      log.error('[cancelJoinTeam] failed', err)

      return res
        .status(500)
        .json({ error: 'UNKNOWN' })
        .end()
   }
  })
}
