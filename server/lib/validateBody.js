const { validationResult } = require('express-validator/check')
const log = require('./log')

module.exports = (logModule) => {
  return (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      log.warn(`[${logModule}] invalid body`, req.body)
      log.warn(errors.array())

      return res
        .status(400)
        .json({ error: errors.array()[0].msg })
        .end()
    }

    next()
  }
}
