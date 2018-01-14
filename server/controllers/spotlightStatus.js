const pick = require('lodash.pick')
const { Team, User, Spotlight } = require('../database')
const { isSpotlightFull } = require('../lib/isFull')

/**
 * GET /spotlightStatus
 *
 * Success response:
 * [
 *    spotlight1: Spotlight,
 *    ...
 * ]
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of []
 */
module.exports = (app) => {
  app
    .get('/spotlightStatus', async (req, res) => {
      try {
        let spotlights = await Spotlight.findAll({
            include: [
              {
                model: Team,
                include: [ User ]
              }
            ]
        })

        spotlights = spotlights.map((spotlight) => {
          spotlight = spotlight.toJSON()

          spotlight.isFull = isSpotlightFull(spotlight, true)

          return pick(spotlight, ['id', 'name', 'isFull'])
        })

        return res
          .status(200)
          .json(spotlights)
          .end()
      } catch (err) {
        log.error('[spotlightStatus] failed', err)

        return res
          .status(500)
          .json({ error: 'UNKNOWN' })
          .end()
      }
    })
}
