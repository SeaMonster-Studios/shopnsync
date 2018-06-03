# Webpack Proxy Starter

This was created to handle asset bundling for websites with a monolithic CMS, such as WordPress.

## Features

* Webpack 4
* Hot Reloading
* Babel
* Flow
* Eslint
* Scss, CSS
* Webpack Dev Server + BrowserSync

## Setup (WordPress)

1.  Copy all files in the repo to the _wp-content/_ directory of your WordPress install.
2.  Include _wp-webpack-scripts.php_ in your _functions.php_ file.
3.  Rename the _.env.example_ file to _.env_

* Add your _PROXY_URL_, example: `http://my-awesome-wp-blog.lndo.site`
* Add your _PUBLIC_PATH_, example: `/wp-content/themes/<MY_AWESOME_THEME_NAME>/dist`

4.  In the terminal and from the _wp-content/_ directory, run `npm install`.
5.  Run `npm start`.

## Terminal Commands

1.  `npm start` will run the webpack dev server and proxy the local install of your WordPress site.

2.  `npm run build` will create the production build of your assets.

## License

MIT
