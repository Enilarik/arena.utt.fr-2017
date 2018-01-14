const { isEmail } = require('validator')
const { sequelize, User } = require('../server/database')
const sendPdf = require('../server/lib/sendPdf')
const log = require('../server/lib/log')
const userMail = process.argv[2]

if (!userMail) {
  log.error('[sendUserMail] No email provided')
  process.exit(1)
}

if (!isEmail(userMail)) {
  log.error('[sendUserMail] No valid email provided')
  process.exit(1)
}

async function sendMail() {
  try {
    const user = await User.findOne({ where: { email: userMail }})

    if (!user) {
      throw new Error('no user found')
    }

    await sendPdf(user)
  } catch (err) {
    log.error(`[sendUserMail] ${err.message}`)
    process.exit(1)
  }
}

sequelize.sync()
  .then(() => sendMail())
  .then(() => log.info(`[sendUserMail] sent email to ${userMail}`))
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
