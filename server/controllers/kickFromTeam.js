const { body } = require('express-validator/check')
const pick = require('lodash.pick')
const { User } = require('../database')
const validateBody = require('../lib/validateBody')
const isAuth = require('../lib/isAuth')
const publicUserFields = require('../lib/publicUserFields')
const log = require('../lib/log')

/**
 * POST /kickFromTeam
 * {
 *   user: String
 * }
 *
 * user must be guid
 *
 * Success response:
 * {
 *
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_USER', 'NO_CAPTAIN']
 */
module.exports = (app) => {
  app.post('/kickFromTeam', isAuth)

  app.post('/kickFromTeam', [
    body('user', 'INVALID_USER').exists().isUUID(),
    validateBody('kickFromTeam')
  ])

  app.post('/kickFromTeam', async (req, res) => {
    if (!req.user.team) {
      log.error(`[kickFromTeam] user ${req.user.name} tried to kick without a team`)

      return res
        .status(401)
        .json({ error: 'INVALID_USER' })
        .end()
    }

    // is captain or self-kick (= leave), else deny
    if (!req.user.isCaptain(req.user.team) && req.user.id !== req.body.user) {
      log.error(`[kickFromTeam] user ${req.user.name} tried to kick without being captain`)

      return res
        .status(401)
        .json({ error: 'NO_CAPTAIN' })
        .end()
    }

    try {
      const user = await User.findOne({
        where: {
          id: req.body.user,
          teamId: req.user.team.id
        }
      })

      await req.user.team.removeUser(req.body.user)

      log.info(`[kickFromTeam] user ${req.user.name} kicked ${user.name}`)

      return res
        .status(200)
        .json({ })
        .end()
    } catch (err) {
      log.error('[kickFromTeam] failed', err)

      return res
        .status(500)
        .json({ error: 'UNKNOWN' })
        .end()
    }
  })
}
