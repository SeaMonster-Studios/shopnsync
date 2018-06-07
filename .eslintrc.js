module.exports = {
  extends: ['eslint:recommended'],
  globals: {
    process: true,
    module: true,
    __dirname: true,
  },
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  plugins: ['babel'],
}
