const { body } = require('express-validator/check')
const { Teamfinder, Team } = require('../database')
const isAuth = require('../lib/isAuth')
const isFrenchString = require('../lib/isFrenchString')
const validateBody = require('../lib/validateBody')
const log = require('../lib/log')

/**
 * POST /teamfinder
 * {
 *   lookingFor: String
 * }
 *
 * lookingFor must be ascii, sized from 8 to 300
 *
 * Success response:
 * {
 *   team: Team,
 *   lookingFor: String,
 *   teamId: Number
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_LOOKINGFOR', 'NO_TEAM', 'NO_CAPTAIN']
 */

module.exports = (app) => {
  app.post('/teamfinder', isAuth)

  app.post('/teamfinder', [
    body('lookingFor', 'INVALID_LOOKINGFOR').exists().custom(isFrenchString).isLength({ min: 8, max: 255 }),
    validateBody('teamfinder')
  ])

  app.post('/teamfinder', isAuth, async (req, res) => {
    if (!req.user.team) {
      log.warn(`[teamfinder] user ${req.user.name} tried to use teamfinder without being in a team`)

      return res
        .status(401)
        .json({ error: 'NO_TEAM' })
        .end()
    }

    if (!req.user.isCaptain(req.user.team)) {
      log.warn(`[teamfinder] user ${req.user.name} tried to use teamfinder without being captain`)

      return res
        .status(401)
        .json({ error: 'NO_CAPTAIN' })
        .end()
    }

    try {
      const teamfinder = await Teamfinder
        .create({
          lookingFor: req.body.lookingFor,
          teamId: req.user.team.id
        })

      log.info(`[teamfinder] ${req.user.team.name}::${req.user.name} asked for ${req.body.lookingFor}`)

      res
        .status(200)
        .send(
          Object.assign(
            { team: req.user.team },
            teamfinder.toJSON()
          )
        )
        .end()
    } catch (err) {
      log.error('[teamfinder] failed', err)
      next(err)
    }
  })
}
