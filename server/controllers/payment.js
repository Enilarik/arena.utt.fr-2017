const { body } = require('express-validator/check')
const jwt = require('jsonwebtoken')
const { User } = require('../database')
const isAuth = require('../lib/isAuth')
const validateBody = require('../lib/validateBody')
const log = require('../lib/log')
const sendPdf = require('../lib/sendPdf')
const config = require('../config')
const etupay = require('node-etupay')(config.etupay)
const Basket = etupay.Basket

const euro = 100
const sex = { M: 'Homme', F: 'Femme' }

async function handlePaylod(payload) {
  try {
    const user = await User.findById(payload.serviceData)

    const userHadPay = user.paid

    if (!user) {
      return res
        .status(404)
        .json({ error: 'USER_NOT_FOUND' })
        .end()
    }

    user.transactionId = payload.transactionId
    user.transactionState = payload.step
    user.paid = payload.paid

    log.info(`[callback] user ${user.name} is at state ${user.transactionState}`)

    await user.save()

    return {
      shouldSendMail: (user.paid && !userHadPay),
      user
    }
  } catch (err) {
    const body = JSON.stringify(payload, null, 2)
    log.error(`[callback] callback error with ${body}`, err)
  }
}

/**
 * POST /payment
 * {
 *   plusone: Boolean,
 *   ethernet: Boolean,
 *   shirtGender: String?,
 *   shirtSize: String?
 * }
 *
 * shirtGender must be "M" or "F"
 * shirtSize must be "XS", "S", "M", "L", or "XL"
 *
 * Success response:
 * {
 *   url: User
 * }
 *
 * Failed response:
 * {
 *   error: String
 * }
 *
 * error must be one of ['INVALID_PLUSONE', 'INVALID_ETHERNET', 'INVALID_SHIRTGENDER', 'INVALID_SHIRTSIZE']
 *
 *
 * POST /callback
 * {
 *   etupay data
 * }
 * POST /success
 * {
 *   etupay data
 * }
 * POST /error
 * {
 *   etupay data
 * }
 */
module.exports = (app) => {
  // use base etupay router
  app.use(etupay.router)

  app.post('/payment', isAuth)

  app.post('/payment', [
    body('lastname', 'INVALID_NAME').exists(),
    body('firstname', 'INVALID_NAME').exists(),
    body('plusone', 'INVALID_PLUSONE').exists().isBoolean(),
    body('ethernet', 'INVALID_ETHERNET').exists().isBoolean(),
    body('shirtGender', 'INVALID_SHIRTGENDER').optional().isIn(['M', 'F']),
    body('shirtSize', 'INVALID_SHIRTSIZE').optional().isIn(['XS', 'S', 'M', 'L', 'XL']),
    validateBody('payment')
  ])

  app.post('/payment', async (req, res) => {
    // step 1 : save user's payment profile (place type, shirt, ethernet cable)
    req.user.plusone = !!req.body.plusone
    req.user.ethernet = !!req.body.ethernet
    req.user.shirt = 'none'

    if (req.body.shirtGender && req.body.shirtSize) {
      req.user.shirt = req.body.shirtGender.toLowerCase() + req.body.shirtSize.toLowerCase()
    }

    await req.user.save()

    // step 2 : determine price (based on profile + mail)
    const mail = req.user.email.toLowerCase()
    const isPartner = (mail.endsWith('@utt.fr') || mail.endsWith('@utc.fr') || mail.endsWith('@utbm.fr'))
    let price = isPartner ? config.prices.partner : config.prices.base

    console.log(req.body)

    // step 3 : create basket
    const basket = new Basket(
      // description
      'Inscription UTT Arena 2017',
      // firstname
      req.body.firstname,
      // lastname
      req.body.lastname,
      // email
      req.user.email,
      // type
      'checkout',
      // service_data
      req.user.id)

    if (req.body.plusone) {
      basket.addItem('Place UTT Arena PlusOne', euro * config.prices.plusone, 1)
    } else {
      basket.addItem('Place UTT Arena', euro * price, 1)
    }

    if (req.user.ethernet) {
      basket.addItem('Cable Ethernet 7m', euro * config.prices.ethernet, 1)
    }

    if (req.user.shirt !== 'none') {
      basket.addItem(`T-Shirt ${sex[req.body.shirtGender]} ${req.body.shirtSize}`, euro * config.prices.shirt, 1)
    }

    log.info(`[payment] user ${req.user.name} is buying`, JSON.stringify(basket.items, null, 2))

    // step 4 : redirect to etupay with basket object
    return res
      .status(200)
      .json({ url: basket.compute() })
      .end()
  })

  // callback
  app.use('/callback', async (req, res) => {
    log.info('[callback]', req.etupay)

    const { shouldSendMail, user } = await handlePaylod(req.etupay)

    console.log('send mail!', shouldSendMail)
    if (shouldSendMail) {
      await sendPdf(user)
    }

    return res
      .status(200)
      .json({ })
      .end()
  })

  app.get('/success', async (req, res, next) => {
    if (req.query.payload) {
      const { shouldSendMail, user } = await handlePaylod(req.etupay)

      console.log('send mail!', shouldSendMail)
      if (shouldSendMail) {
        await sendPdf(user)
      }

      return res.redirect('/dashboard/payment/success')
    }

    next()
  })

  app.get('/dashboard/payment/error', async (req, res, next) => {
    if (req.query.payload) {
      await handlePaylod(req.etupay)

      return res.redirect('/dashboard/payment/error')
    }

    next()
  })
}
