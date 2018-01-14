const pick = require('lodash.pick')
const { body } = require('express-validator/check')
const { User } = require('../database')
const validateBody = require('../lib/validateBody')
const isAuth = require('../lib/isAuth')
const log = require('../lib/log')

/**
 * POST /editUser
 * {
 *   username: String,
 *   email: String
 *   [password]: String
 * }
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
 * error must be one of ['INVALID_NAME', 'INVALID_PASSWORD', 'INVALID_EMAIL', DISABLED_LOGIN', 'ERROR_DUPLICATE_USER']
 */
module.exports = (app) => {
  app.post('/editUser', isAuth)

  app.post('/editUser', [
    body('name', 'INVALID_NAME').exists().isAlphanumeric().isLength({ min: 3, max: 30 }),
    body('password', 'INVALID_PASSWORD').optional().isLength({ min: 6, max: 18 }),
    body('email', 'INVALID_EMAIL').exists().isEmail(),
    validateBody('editUser')
  ])

  app.post('/editUser', async (req, res) => {
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, config.app.bcryptLevel)
      }

      const body = pick(req.body, ['name', 'password', 'email'])

      await req.user.update(body)

      log.info(`[editUser] user ${req.body.name} updated`)

      res
        .status(200)
        .json({ })
        .end()
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res
          .status(400)
          .json({ error: 'ERROR_DUPLICATE_USER' })
          .end()
      }

      log.error('[editUser] failed', err)

      return res
        .status(500)
        .json({ error: 'UNKNOWN' })
        .end()
    }
  });
}
