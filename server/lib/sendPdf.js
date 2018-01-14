const fs = require('fs')
const path = require('path')
const config = require('../config')
const log = require('../lib/log')

const PDFDocument = require('pdfkit')
const cal = require('ical-generator')(config.icalEvent)
const bwipjs = require('bwip-js')
const transporter = require('nodemailer').createTransport(config.mail)

const shirt = {
  none: 'Non',
  fxs : 'Femme — XS',
  fs  : 'Femme — S',
  fm  : 'Femme — M',
  fl  : 'Femme — L',
  fxl : 'Femme — XL',
  mxs : 'Homme — XS',
  ms  : 'Homme — S',
  mm  : 'Homme — M',
  ml  : 'Homme — L',
  mxl : 'Homme — XL'
}

const logoPath = path.join(__dirname, '..', '..', 'client', 'assets', 'ua17_logo.png')
let logo = fs.readFileSync(logoPath, 'base64')
logo = `data:image/jpeg;base64,${logo}`

const rogPath = path.join(__dirname, '..', '..', 'client', 'assets', 'rog.png')
let rog = fs.readFileSync(rogPath, 'base64')
rog = `data:image/png;base64,${rog}`

const bdePath = path.join(__dirname, '..', '..', 'client', 'assets', 'bde.jpg')
let bde = fs.readFileSync(bdePath, 'base64')
bde = `data:image/jpg;base64,${bde}`

const meltdownPath = path.join(__dirname, '..', '..', 'client', 'assets', 'meltdown.png')
let meltdown = fs.readFileSync(meltdownPath, 'base64')
meltdown = `data:image/png;base64,${meltdown}`

const orangePath = path.join(__dirname, '..', '..', 'client', 'assets', 'orange.jpg')
let orange = fs.readFileSync(orangePath, 'base64')
orange = `data:image/jpg;base64,${orange}`

const mailMessage = `Vous avez acheté votre place pour l'UTT Arena 2017
Vous trouverez la place en format numérique en pièce jointe. Veuillez conserver la place : elle sera nécessaire pour entrer à l'UTT Arena.

À bientôt pour l'UTT Arena !


Toute l'équipe organisatrice`

const htmlMessage = fs.readFileSync(path.join(__dirname, 'template.html'))

cal.createEvent({
  start: new Date(config.app.startingDate),
  end: new Date(config.app.endingDate),
  summary: 'UTT Arena 2017',
  description: 'UTT Arena 2017',
  location: '20 Rue des Gayettes, 10000 Troyes, France',
  url: 'https://arena.utt.fr'
})

function generateBarcode(user) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: 'ean13',
      text: user.barcode,
      height: 10,
      includetext: false
    }, function (err, png) {
      if (err) {
        reject(err)
      }

      resolve(png)
    })
  })
}

function generatePdf(user, barcode) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()

    doc.image(logo, (doc.page.width - 350) / 2, 30, { width: 350, height: 350 })

    doc
        .fontSize(20)
        .text(`Nom: ${user.name}`, 20, 400)
        .text(`T-Shirt: ${shirt[user.shirt || 'none']}`, 20, 420)
        .text(`Accompagnateur: ${user.plusone ? 'Oui' : 'Non'}`, 20, 440)

    doc.image(barcode, 215, 500)

    doc.image(rog, 70, 575, { width: 171, height: 35 })
    doc.image(bde, 261, 575, { width: 86, height: 50 })
    doc.image(meltdown, 367, 575, { width: 66, height: 61 })
    doc.image(orange, 453, 575, { width: 60, height: 60 })

    const buffers = []

    doc.on('data', chunk => buffers.push(chunk))

    doc.on('end', () => resolve(Buffer.concat(buffers)))

    doc.end()
  })
}

module.exports = async (user) => {
  const barcode = await generateBarcode(user)
  const pdf = await generatePdf(user, barcode)

  log.info(`[generatePdf] sending mail to ${user.email}`)

  return transporter.sendMail({
      from: '"UTT Arena 2017" <arena@utt.fr>',
      to: user.email,
      subject: 'Place UTT Arena 2017',
      text: mailMessage,
      html: htmlMessage,
      attachments: [
          { filename: `UTT.Arena.2017.pdf`, content: pdf }
      ],
      icalEvent: {
        filename: 'UTT.Arena.2017.ics',
        method: 'request',
        content: cal.toString()
      }
  })
}
