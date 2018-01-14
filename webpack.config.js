const { join, resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const RobotstxtPlugin = require('robotstxt-webpack-plugin').default
const OfflinePlugin = require('offline-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
  name: 'bundle',
  entry: './client/main.js',
  output: {
    filename: '[name].js',
    path: join(__dirname, 'public'),
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  devtool: IS_PROD ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          resolve(__dirname, './client')
        ]
      },
      {
        test: /\.css?$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: IS_PROD
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|webp|gif|eot|otf|webp|svg|ttf|woff|woff2)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': IS_PROD ? '"production"' : '"development"'
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'client', 'index.html'),
      minify: {
        minifyJS: true,
        minifyCSS: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new WriteFilePlugin()
  ]
}

if (IS_PROD) {
  module.exports.plugins.push(
    // favicon and all icons
    new FaviconsWebpackPlugin(resolve(__dirname, 'client', 'assets', 'ua17_logo.png')),
    // Google site verification
    new CopyWebpackPlugin([
      { from: resolve(__dirname, 'client', 'assets', 'google5be15d1251a271c2.html') },
      { from: resolve(__dirname, 'client', 'assets', 'ua17_logo.png') },
      { from: resolve(__dirname, 'client', 'assets', 'share.png') }
    ]),
    // sitemap.xml
    new SitemapPlugin('https://arena.utt.fr', [
      { path: '/', changeFreq: 'weekly' }
    ]),
    // robots.txt
    new RobotstxtPlugin({
      policy: [
          {
              userAgent: '*',
              disallow: ''
          }
      ],
      sitemap: 'https://arena.utt.fr/sitemap.xml',
      host: 'https://arena.utt.fr'
    }),
    new UglifyJSPlugin(),
    new WebpackPwaManifest({
      name: 'UTT Arena 2017',
      short_name: 'UA 2017',
      start_url: 'https://arena.utt.fr',
      description: 'UTT Arena 2017 — 8, 9 et 10 décembre 2017',
      background_color: '#30334c',
      theme_color: '#30334c',
      icons: [
        {
          src: resolve(__dirname, 'client', 'assets', 'ua17_logo.png'),
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    }),
    new OfflinePlugin({
      relativePaths: false,
      ServiceWorker: {
        events:true,
        navigateFallbackURL:'/'
      },
      AppCache: {
        events:true,
        FALLBACK:{ '/':'/' }
      }
    })
  )
}

if (!IS_PROD) {
  module.exports.entry = [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    'webpack/hot/only-dev-server',
    './client/main.js'
  ]

  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}
