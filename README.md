# Shopnsync

## Setup

1.  Get a local copy of your theme (any theme will do) and then do the following...
2.  Install shopnsync globally: `npm i -g @seamonster-studios/shopnsync`
3.  Install themekit with brew:
    1.  `brew tap shopify/shopify`
    2.  `brew install themekit`
4.  Run `sns init` to copy files and install dependencies
5.  Open `config.yml` and add your _theme_id_, _store_, and private app _password_ per [Themekit's documentation](https://shopify.github.io/themekit/configuration/)
    - When you create your private app, be sure to give it read/write permissions for your theme files. Also, you need the _Password_ of the private app, not the _API_key_.
6.  If your site is currently protected by a password, you'll also need to add the access _key_ to config.yml. You can get this by:
    1.  Going to the _themes_ page of your shopify store.
    2.  Click on the _Actions_ dropdown next to the theme you're working on.
    3.  Click the _Preview_ link.
    4.  They kew will now be a url parameter on the theme preview page. Copy everything after the _key=_, and place that in your config.yml.

## Terminal Commands

- `sns init`: Copies Shopnsync files and dependencies to your theme folder.
- `sns start`: Starts the Webpack developent server.
- `sns build`: Bundles your assets and places them in the _assets_ directory of your theme. It also uploads all file changes to Shopify.
- `sns pull`: An alias for themekit's `theme download`. Pull changes from Shopify store. This can overwrite any local files that have an older timestamp that what is in the Shopify store.
- `sns pull:force`: An alias for themekit's `theme download --force`. Completely overwrites any local files with what is on the Shopify store, regardless of timestamp.
- `sns package`: Zip theme for uploading to Shopify store.

## Webpack Config Includes:

- Webpack 4
- Hot Reloading
- Babel
- Flow
- Eslint
- Scss, CSS
- Webpack Dev Server + BrowserSync

## Notes

- If you get a _WDS Disconnected!_ message in your console (and you're using Chrome), be sure to enable the "Allow invalid certificates for resources loaded from localhost." in Chrome by going to [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost)
- If you're used to using Themekit you may notice that the Preview Bar is no longer visible. Our personal opinion is that it's visibliy in the way when developing. However, you'll still be able to see if you're previewing a theme via a [Shopnsync] message displayed in the console.

## Why Shopnsync (why not Slate)?

Shopnsync was inspired by Slate, and we are very grateful to the work the Slate team does. In the end however, we found Slate didn’t mesh well with our workflow for a couple of reasons.

Slate is a zero-config setup, but extending or modifying that config wasn’t possible pre-beta and documentation for doing so now is lacking. Not having to worry about configuration is nice, and we believe in the zero-config setup. However, not at the expense of extending or customizing that configuration. As developers we understand that while many of our projects share a lot of the same requirements, each project is a little different. As such, we put the configs that Shopnsync uses at your fingertips.

In the same vein as theme configuration is installing Shopify Apps. We like the ability to use Shopify apps, and to be able to install them at any stage of development. Sometimes apps need to inject code into different templates. Because your theme is entirely generated from source when using Slate, it makes modifying any code on Shopify a frustrating process. We found the round trip of running a Slate build, pulling the theme from Shopify into a different directory, diffing those changes, copying those differences into the src files, then recompiling and uploading that theme to Shopify to be tedious.

Overall, Slate is a great tool and it is a good fit for a lot of developers. It just doesn’t go well with our workflow, and think there may be other devs. out there who feel the same. So, if you want a modern developer workflow building Shopify themes that makes using Shopify Apps a breeze, and with full config customization, look no further.

### Disclaimers

- Shopnsync is currently in beta and is open-source. If you find any bugs or have any feedback please let us know on [github](https://github.com/SeaMonster-Studios/shopnsync).
- These opinions and assumptions were made of Slate pre-beta. However, upon looking into Slate-beta, they still appear to hold true.

## License

MIT
