const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const fs = require('fs')
const yaml = require('js-yaml')
const webpack = require('webpack')
const shell = require('shelljs')
const colors = require('colors')

const { development: yamlDev, ...yamlConfig } = yaml.load(
  fs.readFileSync('./config.yml', { encoding: 'utf-8' }),
)
const conf = {
  ...yamlDev,
  ...yamlConfig,
  browserSyncPort: yamlConfig.port || 3500,
  webpackPort: 9500,
  proxy: `https://${yamlDev.store}/`,
  proxyParams: `?preview_theme_id=${yamlDev.theme_id}`,
}

const queryStringComponents = []
/**
 * Shopify sites with redirection enabled for custom domains force redirection
 * to that domain. `?_fd=0` prevents that forwarding. (Thanks Slate team!)
 */
queryStringComponents.push('_fd=0')

const commonConfig = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
    ],
  },
  plugins: [],
}

const envConfig = (mode, common) =>
  mode !== 'development'
    ? {
        module: {
          rules: [
            ...common.module.rules,
            {
              test: /\.(s)?css$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
              }),
            },
          ],
        },
        plugins: [
          ...common.plugins,
          new ExtractTextPlugin({
            filename: 'app.css',
            disable: false,
            allChunks: true,
          }),
        ],
      }
    : {
        output: {
          ...common.output,
          publicPath: '/dist/',
        },
        devtool: 'inline-source-map',
        devServer: {
          compress: false,
          port: conf.webpackPort,
          hot: true,
          https: true,
          publicPath: '/dist/',
          overlay: {
            errors: true,
            warnings: false,
          },
          proxy: [
            {
              context: ['**'],
              target: conf.proxy,
              secure: false,
              changeOrigin: true,
              autoRewrite: false,
            },
          ],
        },
        module: {
          rules: [
            ...common.module.rules,
            {
              test: /\.(s)?css$/,
              use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader',
              ],
            },
          ],
        },
        plugins: [
          ...common.plugins,
          new webpack.NamedModulesPlugin(),
          new BrowserSyncPlugin(
            {
              // host: 'localhost',
              port: conf.browserSyncPort,
              // https: true,
              proxy: {
                target: `https://localhost:${conf.webpackPort}${
                  conf.proxyParams
                }`,
                middleware: (req, res, next) => {
                  const prefix = req.url.indexOf('?') > -1 ? '&' : '?'
                  req.url += prefix + queryStringComponents.join('&')
                  next()
                },
              },
              rewriteRules: [
                {
                  match: new RegExp(conf.proxy, 'g'),
                  fn: (req, res, match) =>
                    `http://localhost:${conf.browserSyncPort}`,
                },
                {
                  match: new RegExp('".*(app.css|app.js).*?"', 'gm'),
                  replace: '/dist/$1',
                },
              ],
              open: false,
              files: [
                {
                  match: [
                    '**/*.liquid',
                    '**/*.json',
                    './assets/**',
                    '!./assets/app.js',
                    '!./assets/app.css',
                  ],
                  fn: async function(event, file) {
                    if (event === 'change') {
                      try {
                        console.log(
                          `[${colors.blue('Shopnsync')}] ${colors.black(
                            colors.bgYellow('Uploading'),
                          )} ${colors.cyan(file)} to Shopify...`,
                        )
                        const response = await shell.exec(
                          `theme upload ${file} > "/dev/null" 2>&1`,
                        )

                        console.log(
                          `[${colors.blue('Shopnsync')}] ${colors.cyan(
                            file,
                          )} was  ${colors.black(
                            colors.bgGreen('successfully uploaded'),
                          )} to Shopify.`,
                        )
                        const bs = require('browser-sync').get(
                          'bs-webpack-plugin',
                        )
                        bs.reload()
                      } catch (error) {
                        throw new Error(error)
                      }
                    }
                  },
                },
              ],
            },
            {
              // prevent BrowserSync from reloading the page
              // and let Webpack Dev Server take care of this
              reload: false,
            },
          ),
        ],
      }

module.exports = (env, argv) => ({
  ...commonConfig,
  ...envConfig(argv.mode, commonConfig),
})
