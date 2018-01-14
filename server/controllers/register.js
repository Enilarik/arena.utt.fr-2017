const { body } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const { User } = require('../database')
const validateBody = require('../lib/validateBody')
const log = require('../lib/log')
const random = require('../lib/random')
const config = require('../config')

/**
 * POST /register
 * {
 *   name: String,
 *   password: String
 *   email: String
 * }
 *
 * name must be [a-Z0-9]
 * password must be [a-Z0-9]
 * email must be a valid e-mail
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
 * error must be one of ['INVALID_NAME', 'INVALID_PASSWORD', 'INVALID_EMAIL', DISABLED_REGISTER', 'ERROR_DUPLICATE_USER']
 */
module.exports = (app) => {
  app.post('/register', [
    body('name', 'INVALID_NAME').exists().isAlphanumeric().isLength({ min: 3, max: 30 }),
    body('password', 'INVALID_PASSWORD').exists().isLength({ min: 6, max: 18 }),
    body('email', 'INVALID_EMAIL').exists().isEmail(),
    validateBody('register')
  ])

  app.post('/register', async (req, res) => {
    if (config.app.disableLogin) {
      log.warn('[register] tried to register while it\'s disabled', { name: req.body.name })

      return res
        .status(403)
        .json({ error: 'DISABLED_REGISTER' })
        .end()
    }

    try {
      req.body.barcode = random(config.app.barcodeLength)
      req.body.password = await bcrypt.hash(req.body.password, config.app.bcryptLevel)
      await User.create(req.body)

      log.info(`[register] user ${req.body.name} created`)
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res
          .status(400)
          .json({ error: 'ERROR_DUPLICATE_USER' })
          .end()
      }

      log.error('[register] failed', err)
      next(err)
    }

    res
      .status(200)
      .json({})
      .end()
  })
}
