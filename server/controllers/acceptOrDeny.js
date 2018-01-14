const { body } = require('express-validator/check')
const { AskingUsers, User } = require('../database')
const validateBody = require('../lib/validateBody')
const isAuth = require('../lib/isAuth')
const log = require('../lib/log')

/**
 * POST /acceptOrDeny
 * {
 *   user: String,
 *   verdict: String
 * }
 *
 * user must be guid
 * verdict must be 'allow' or 'deny'
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
 * error must be one of ['USER_DIDNT_ASK', 'NO_CAPTAIN', 'NO_TEAM', 'HE_IS_ALREADY_IN_TEAM', 'INVALID_VERDICT']
 *
 */
module.exports = (app) => {
  app.post('/acceptOrDeny', isAuth)

  app.post('/acceptOrDeny', [
    body('user', 'INVALID_USER').exists().isUUID(),
    body('verdict', 'INVALID_VERDICT').exists().isIn(['accept', 'refuse']),
    validateBody('acceptOrDeny')
  ])

  app.post('/acceptOrDeny', async (req, res) => {
    if (!req.user.team) {
      return res
        .status(401)
        .json({ error: 'NO_TEAM' })
        .end()
    }

    if (!req.user.isCaptain(req.user.team)) {
      return res
        .status(401)
        .json({ error: 'NO_CAPTAIN' })
        .end()
    }

    try {
      const affectedRows = await AskingUsers.destroy({
        where: {
          userId: req.body.user,
          teamId: req.user.team.id
        }
      })

      const otherUser = await User.findById(req.body.user)

      if (affectedRows === 0) {
        log.error(`[acceptOrDeny] team ${req.user.team.name} forced ${otherUser.name} into team`)
        return res
          .status(401)
          .json({ error: 'USER_DIDNT_ASK' })
          .end()
      }

      if (otherUser.teamId) {
        log.warn(`[acceptOrDeny] team ${req.user.team.name} accpeted ${otherUser.name} but he was already in other team`)
        return res
          .status(401)
          .json({ error: 'HE_IS_ALREADY_IN_TEAM' })
          .end()
      }

      if (req.body.verdict === 'accept') {
        await req.user.team.addUser(req.body.user)
      }

      log.info(`[acceptOrDeny] team ${req.user.team.name} ${req.body.verdict} ${otherUser.name}`)

      res
        .status(200)
        .json({ })
        .end()
    } catch (err) {
      log.error('[acceptOrDeny] failed', err)

      return res
        .status(500)
        .json({ error: 'UNKNOWN' })
        .end()
    }
  })
}
