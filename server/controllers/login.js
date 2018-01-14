const { body } = require('express-validator/check')
const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const { User } = require('../database')
const validateBody = require('../lib/validateBody')
const log = require('../lib/log')
const publicUserFields = require('../lib/publicUserFields')
const config = require('../config')

/**
 * GET /canLogin
 *
 * Success response:
 * {
 *   canLogin: Boolean
 * }
 *
 * POST /login
 * {
 *   username: String,
 *   password: String
 * }
 *
 * username must be [a-Z0-9]
 * password must be [a-Z0-9]
 *
 * Success response:
 * {
 *   user: User,
 *   token: String
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_USERNAME', 'INVALID_PASSWORD', 'DISABLED_LOGIN', 'INVALID_LOGIN']
 */
module.exports = (app) => {
  app.get('/canLogin', (req, res) => {
    res
      .status(200)
      .json({ canLogin: !config.app.disableLogin })
      .end()
  })

  app.post('/login', [
    body('username', 'INVALID_USERNAME').exists().isAlphanumeric(),
    body('password', 'INVALID_PASSWORD').exists(),
    validateBody('login')
  ])

  app.post('/login', async (req, res) => {
    if (config.app.disableLogin) {
      log.warn(`[login] ${req.body.username}tried to login while it\'s disabled`)

      return res
        .status(403)
        .json({ error: 'DISABLED_LOGIN' })
        .end()
    }

    const username = req.body.username
    const password = req.body.password

    let user
    try {
      user = await User.findOne({ where: { $or: [ { name: username }, { email: username } ] } })

      if (!user) {
        log.warn(`[login] user ${username} couldn't be found`)

        return res
          .status(400)
          .json({ error: 'INVALID_LOGIN' })
          .end()
      }

      const passwordMatch = await user.validatePassword(password)

      if (passwordMatch) {
        const token = jwt.sign({ id: user.id }, config.app.secret, { expiresIn: '2 hours' })

        log.info(`[login] user ${user.name} logged`)

        res
          .status(200)
          .json({
            user: pick(user, publicUserFields),
            token
          })
          .end()
        } else {
          log.warn(`[login] failed for ${username}`)

          return res
            .status(403)
            .json({ error: 'INVALID_LOGIN' })
            .end()
        }
    } catch (err) {
      log.error('[login] failed', err)

      return res
        .status(403)
        .json({ error: 'INVALID_LOGIN' })
        .end()
    }
  })
}
