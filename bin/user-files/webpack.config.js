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
  key: yamlConfig.preview_key || '',
  browserSyncPort: yamlConfig.port || 3600,
  webpackPort: yamlConfig.port - 50 || 3550,
  proxy: `https://${yamlDev.store}`,
}

const queryStringComponents = ['_fd=0']

const commonConfig = {
  entry: ['./src/index.js'],
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
        entry: [
          ...common.entry,
          '@seamonster-studios/shopnsync-scripts/theme-preview-notice.js',
        ],
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
          proxy: [
            {
              context: ['**', '!/dist/'],
              target: conf.proxy,
              changeOrigin: true,
              autoRewrite: true,
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
              port: conf.browserSyncPort,
              https: true,
              proxy: {
                target: `https://localhost:${conf.webpackPort}?key=${
                  conf.key
                }&preview_theme_id=${conf.theme_id}`,
                middleware: (req, res, next) => {
                  const prefix = req.url.indexOf('?') > -1 ? '&' : '?'
                  req.url += prefix + queryStringComponents.join('&')
                  next()
                },
              },
              rewriteRules: [
                {
                  match: new RegExp(conf.proxy, 'g'),
                  fn: () => `https://localhost:${conf.browserSyncPort}`,
                },
                {
                  match: new RegExp('".*assets/(app.js)"?', 'g'),
                  replace: '/dist/$1',
                },
                {
                  match: 'previewBarInjector.init();',
                  replace: '',
                },
              ],
              open: false,
              files: [
                {
                  match: ['**/*.liquid', '**/*.json', './assets/**'],
                  fn: async function(event, file) {
                    if (event === 'change') {
                      try {
                        console.log(
                          `[${colors.blue('Shopnsync')}] ${colors.black(
                            colors.yellow('Uploading'),
                          )} ${colors.cyan(file)} to Shopify...`,
                        )
                        await shell.exec(`theme upload ${file}`)

                        console.log(
                          `[${colors.blue('Shopnsync')}] ${colors.cyan(
                            file,
                          )} was  ${colors.black(
                            colors.green('successfully uploaded'),
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
              reload: false,
            },
          ),
        ],
      }

module.exports = (env, argv) => ({
  ...commonConfig,
  ...envConfig(argv.mode, commonConfig),
})
