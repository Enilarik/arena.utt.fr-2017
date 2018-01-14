const { body } = require('express-validator/check')
const pick = require('lodash.pick')
const { AskingUsers, User, Team, Spotlight } = require('../database')
const validateBody = require('../lib/validateBody')
const isAuth = require('../lib/isAuth')
const publicUserFields = require('../lib/publicUserFields')
const log = require('../lib/log')
const { isSpotlightFull, isTeamFull } = require('../lib/isFull')
const tournaments = require('../config/tournaments.json')

/**
 * POST /joinTournament
 * {
 *   tournament: id
 * }
 *
 * user must be id
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
 * error must be one of ['INVALID_TOURNAMENT', 'NO_TEAM', 'TEAM_NOT_FULL', 'NOT_PAID', 'TOURNAMENT_FULL', 'NO_CAPTAIN']
 *
 *
 * POST /leaveTournament
 * {
 *
 * }
 *
 * user must be id
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
 * error must be one of ['INVALID_TOURNAMENT', 'NO_CAPTAIN']
 */
module.exports = (app) => {
  app.post('/leaveTournament', isAuth)

  app.post('/joinTournament', isAuth)

  app.post('/joinTournament', [
    body('tournament')
      .exists()
      .isNumeric()
      .custom(value => !!tournaments[value - 1]),
    validateBody('joinTournament')
  ])

  app.post('/leaveTournament', async (req, res) => {
    if (!req.user.team) {
      log.error(`[leaveTournament] user ${req.user.name} tried to leave a tounrnament without a team`)

      return res
        .status(401)
        .json({ error: 'NO_TEAM' })
        .end()
    }

    if (!req.user.isCaptain(req.user.team)) {
      log.error(`[leaveTournament] user ${req.user.name} tried to leave a tounrnament without being captain`)

      return res
        .status(401)
        .json({ error: 'NO_CAPTAIN' })
        .end()
    }

    try {
      await req.user.team.update({
        spotlightId: null
      })

      if (req.user.team.soloTeam) {
        await req.user.team.destroy()
      }

      return res
        .status(200)
        .json({ })
        .end()
    } catch (err) {
      log.error('[leaveTournament] failed', err)

      return res
        .status(404)
        .json({ error: 'NO_TEAM'})
        .end()
    }
  })

  app.post('/joinTournament', async (req, res) => {
    const requireTeam = tournaments[req.body.tournament - 1].perTeam > 1
    const withoutTeam = !req.user.team || req.user.team.soloTeam

    // Tournament needs team and no team
    if (requireTeam && withoutTeam) {
      log.error(`[joinTournament] user ${req.user.name} tried to join a tounrnament without a team`)

      return res
        .status(401)
        .json({ error: 'NO_TEAM' })
        .end()
    }

    // Tournament needs team and no captain
    if (requireTeam && !withoutTeam && !req.user.isCaptain(req.user.team)) {
      log.warn(`[joinTournament] user ${req.user.name} tried to join a tounrnament without being captain`)

      return res
        .status(401)
        .json({ error: 'NO_CAPTAIN' })
        .end()
    }

    // User hasnt pay. Must be after TEAM_NOT_FULL as error will be different
    // We don't want a captain having NOT_PAID error
    if (!req.user.paid) {
      log.warn(`[joinTournament] user ${req.user.name} tried to join a single tournament without having paid`)

      return res
        .status(401)
        .json({ error: 'NOT_PAID' })
        .end()
    }

    try {
      const tournament = await Spotlight.findById(req.body.tournament, {
        include: [
          {
            model: Team,
            include: [ User ]
          }
        ]
      })

      // Tournament needs team and team not full/paid
      if (requireTeam && !withoutTeam && !isTeamFull(req.user.team, tournament.perTeam, true)) {
        log.warn(`[joinTournament] user ${req.user.name} tried to join a tounrnament without a full team`)

        return res
          .status(401)
          .json({ error: 'TEAM_NOT_FULL' })
          .end()
      }

      // Tournament is full
      if (isSpotlightFull(tournament)) {
        log.error(`[joinTournament] user ${req.user.name} tried to join a full tounrnament`)

        return res
          .status(401)
          .json({ error: 'TOURNAMENT_FULL' })
          .end()
      }

      let team = null

      if (!req.user.team) {
        team = await Team.create({
          name: req.user.name,
          captainId: req.user.id,
          soloTeam: true
        })

        await req.user.setTeam(team)

        await AskingUsers.destroy({
          where: {
            userId: req.user.id
          }
        })

        log.info(`[joinTournament] user ${req.user.name} created self-team`)

      } else {
        team = req.user.team
      }

      await team.setSpotlight(req.body.tournament)

      log.info(`[joinTournament] team ${team.name} joined ${tournament.name}`)

      return res
        .status(200)
        .json({ team })
        .end()
    } catch (err) {
      log.error('[joinTournament] failed', err)

      return res
        .status(404)
        .json({ error: 'INVALID_TOURNAMENT'})
        .end()
    }
  })
}
