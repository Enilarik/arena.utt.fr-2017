const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const { User, Team, Spotlight } = require('../database')
const publicUserFields = require('../lib/publicUserFields')
const log = require('../lib/log')
const config = require('../config')

module.exports = (req, res, next) => {
  const auth = req.get('token')

  if (!auth) {
    return res.status(401).json({
      error: 'NO_TOKEN'
    })
  }

  jwt.verify(auth, config.app.secret, async (err, decoded) => {
    if (err) {
      log.error('[isAuth] failed', err)

      return res.status(401).json({
        error: 'INVALID_TOKEN'
      })
    }

    let user
    try {
      user = await User.findById(decoded.id, {
        include: [
          {
            model: Team,
            include: [
              User,
              Spotlight
            ]
          }
        ]
      })

      req.user = user

      next()

    } catch (err) {
      log.error('[isAuth] failed', err.name)

      return res
        .status(401)
        .json({
          error: 'INVALID_TOKEN'
        })
        .end()
    }
  })
}
