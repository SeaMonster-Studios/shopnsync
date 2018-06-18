module.exports = {
  extends: ['eslint:recommended'],
  globals: {
    process: true,
    module: true,
    __dirname: true,
    document: true,
  },
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  plugins: ['babel'],
  rules: {
    'no-console': 0,
  },
}
