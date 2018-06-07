# Shopnsync

## Setup

1.  Get a local copy of your theme and then do the following...
2.  Install `@seamonster-studios/shopnsync` globally
3.  Install @shopify/themekit globally
4.  Run `sns init` to copy files and install dependencies
5.  Open `config.yml` and add your _theme_id_, _store_, and private app _password_ per [Themekit's documentation](https://shopify.github.io/themekit/configuration/)

## Terminal Commands

- `sns init`: Copies Shopnsync files and dependencies to your theme folder.
- `sns start`: Starts the Webpack developent server.
- `sns build`: Bundles your assets and places them in the _assets_ directory of your theme.
- `sns package`: Zips your theme so that you can manually upload it to the Shopify store if necessary.

## Webpack Config Includes:

- Webpack 4
- Hot Reloading
- Babel
- Flow
- Eslint
- Scss, CSS
- Webpack Dev Server + BrowserSync

## License

MIT
