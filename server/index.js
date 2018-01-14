const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { validationResult } = require('express-validator/check')
const serveStatic = require('serve-static')
const compression = require('compression')
const helmet = require('helmet')
const webpackMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const config = require('./config')
const log = require('./lib/log')
const { sequelize, seed } = require('./database')

const CLIENT = path.join(__dirname, '..', 'public')

const app = express()

process.on('unhandledRejection', (err) => {
  console.log(err)
})

app.use(compression())
app.use(helmet())
app.use(cookieParser(config.app.secret, { secure: config.app.isHTTPS, sameSite: 'strict' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./controllers').forEach((controller) => {
  controller(app)
})

let waitForInitialBuild = () => Promise.resolve()

if (process.env.NODE_ENV === 'development') {
  const webpackConfig = require('../webpack.config.js')
  const compiler = webpack(webpackConfig)

  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      assets: false,
      chunks: false,
      colors: true,
      hash: false,
      version: false
    },
    hot: true,
    historyApiFallback: true
  }))

  app.use(require('webpack-hot-middleware')(compiler))
} else {
  const webpackConfig = require('../webpack.config.js')

  waitForInitialBuild = () => new Promise((resolve) => {
    console.log('Waiting for client building...')

    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(err)
        console.log(stats.toString())

        throw new Error('Build failed')
      }

      console.log(stats.toString('minimal'))
      resolve()
    })
  })
}

app.use(serveStatic(CLIENT, { maxAge: '7 days' }))

app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT, 'index.html'))
})

app.use((error, req, res, _) => {
  log.error(error)

  res
    .status(500)
    .json({ error: 'UNKNOWN' })
    .end()
})

async function start() {
  await waitForInitialBuild()
  await sequelize.sync({ force: config.db.resetOnStartup })
  await seed()

  app.listen(config.app.port, () => {
    log.info(`Listenning on port ${config.app.port}`);
  });
}

start()

