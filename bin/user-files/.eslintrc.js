module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
  ],
  globals: {
    Raven: true,
    jQuery: true,
    $: true,
    Promise: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  parser: 'babel-eslint',
  plugins: ['babel', 'react', 'jest'],
  rules: {
    'react/no-unused-prop-types': 1,
    'react/prop-types': 1,
    'react/display-name': 0,
    'arrow-body-style': 0,
    'class-methods-use-this': 0,
    'max-len': 0,
  },
}
