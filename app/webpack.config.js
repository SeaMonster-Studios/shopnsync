const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const yaml = require('js-yaml')
const webpack = require('webpack')

const { development: yamlDev, ...yamlConfig } = yaml.load(
  fs.readFileSync('./config.yml', { encoding: 'utf-8' }),
)
const conf = {
  ...yamlDev,
  ...yamlConfig,
  proxy: `https://${conf.store}/?preview_theme_id=${conf.theme_id}`,
  browserSyncPort: yamlConfig.port || 3500,
  webpackPort: 9500,
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
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
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
              outputPath: 'fonts/',
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
              outputPath: 'images/',
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
          new CleanWebpackPlugin(['dist']),
          new ExtractTextPlugin({
            filename: 'style.css',
            disable: false,
            allChunks: true,
          }),
        ],
      }
    : {
        output: {
          ...common.output,
          publicPath: process.env.PUBLIC_PATH,
        },
        devtool: 'inline-source-map',
        devServer: {
          compress: false,
          port: conf.webpackPort,
          hot: true,
          publicPath: process.env.PUBLIC_PATH,
          overlay: {
            errors: true,
            warnings: false,
          },
          proxy: [
            {
              context: ['**', `!${process.env.PUBLIC_PATH}/**`],
              target: conf.proxy,
              secure: false,
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
              host: 'localhost',
              port: conf.browserSyncPort,
              proxy: {
                target: `http://localhost:${conf.webpackPort}`,
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
                  match: new RegExp(
                    '//cdn.shopify.com/.*/files/.*/assets/((.(?!.*.scss))*$)',
                    'gm',
                  ),
                  replace: '/$1',
                },
              ],
              open: false,
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
