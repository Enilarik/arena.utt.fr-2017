const { body } = require('express-validator/check')
const { Team } = require('../database')
const validateBody = require('../lib/validateBody')
const isAuth = require('../lib/isAuth')
const log = require('../lib/log')

/**
 * POST /createTeam
 * {
 *   teamName: String
 * }
 *
 * Success response:
 * {
 *   team: Team
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_TEAM', 'ALREADY_IN_TEAM']
 */
module.exports = (app) => {
  app.post('/createTeam', isAuth)

  app.post('/createteam', [
    body('teamName', 'INVALID_TEAMNAME').exists().matches(/^[A-zÀ-ÿ0-9 ]{3,}$/i),
    validateBody('createTeam')
  ])

  app.post('/createTeam', async (req, res) => {
    if (req.user.teamId !== null) {
      log.warn(`[createTeam] user ${req.user.name} tried to create team while he already has one`)

      return res
        .status(400)
        .json({ error: 'ALREADY_IN_TEAM' })
        .end()
    }

    try {
      const newTeam = await Team.create({
        name: req.body.teamName,
        captainId: req.user.id
      })

      await req.user.setTeam(newTeam)

      log.info(`[createTeam] user ${req.user.name} created team ${req.body.teamName}`)

      return res
        .status(200)
        .json({
          team: newTeam
        })
        .end()
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res
          .status(400)
          .json({ error: 'ERROR_DUPLICATE_TEAMNAME' })
          .end()
      }

      log.error('[createTeam] failed', err)

      return res
        .status(500)
        .json({ error: 'UNKNOWN' })
        .end()
    }
  });
}
