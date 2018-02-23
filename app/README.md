# SMS
A Shopify *build system* for developers created by SeaMonster Studios

*NOTE: Still in Alpha. Please report any bugs you find or suggestions you may have.*

## Requirements
* node: >=9.0.0
* yarn

## Getting Started
* Make sure you have [Shopify ThemeKit](https://shopify.github.io/themekit/) installed globally
* Install shopnsync globally with `yarn global add shopnsync` or `npm i -g shopnsync`
* Setup shopnsync for your theme
  * Make sure your theme (any theme works) is installed in your Shopify store
  * Make sure you have those theme files local
  * In the same directory of your theme, run `shopnsync init`. This will copy the build system to your theme, and install necessary dependencies. *Note:* It is recommended that you have your theme backed up (git is recommended) before doing this. You shouldn't need to worry about any conflicts, but if you have files of the same name (listed below) it'll replace them.
* Setup Authentication, and get theme ID. [Instructions here](https://shopify.github.io/themekit/#get-api-access)
  * Note: after doing this, you should have updated the `password`, `theme_id`, and `store` variables in the *config.yml* file.
* Get asset_url (this part is a little annoying but necessary to get assets livereloading correctly). Instructions for doing so in Chrome are below, but other browsers should be similar.
  1. Preview your theme in Shopify
  2. Right click on the page, click "View Page Source".
  3. Do a page search (CMD + F for mac, CTR + F for PC/Linux) for `assets`
  4. It should start with `//cdn.shopify.com/files` — copy everything from there to `assets/` (including the forward slash). Note: it should be similar to what's already in the *config.yml* by default.
  5. Replace the `asset_url` in the *config.yml* with the text you just copied.
* Run `yarn start`

## Features
* This Shopify starter kit was forked from [this Gulp starter](https://github.com/logancalldev/gulp-starter-babel-2.0), but modified for the Shopify environment.
* Gulp running behind the schenes with ability to modify/extend
* Babel transpiling your code from modern JS to browser friendly (ES5)
* Scss –> CSS
* Eslint
* Stylelint
* Browsersync reloading – It loads assets locally instead of from Shopify (faster reloads)
* Shopify's Themekit under the hood so that you can push to and pull code from there. Browsersync detects when you make local liquid (and asset changes) and pushes them to your theme.
* Minification/Uglifying
* Sourcemapping
* Cachebusting
* Currently uses the default theme from the Shopify Slate project

## Customizability
* I intentionally copy all the configs and Gulpfile to your theme directory so that you can modify w/e you want for your needs.

## Files copied from `shopnsync init`
.eslintrc.json
.gitignore
.stylelintrc.json
.themekit_ignores
config.yml
Gulpfile.js
package.json
README.md
theme.lock
yarn.lock
src/scripts/...
src/styles/...

