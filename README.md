# Shopnsync

> DEPRECATED: Recommend using Themekit + Prepros (https://www.shopify.com/partners/blog/live-reload-shopify-sass)

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
- `sns pull`: An alias for themekit's `theme download`. It will download the entire theme from shopify to your local machine.
- `sns pull:force`: An alias for themekit's `theme download --force`. The same as `sns pull` except it will also disable version checking and force all changes.
- `sns push`: An alias for themekit's `theme replace`. This will completely replace what is on Shopify with what is in your current project directory. This means that any files that are on Shopify but are not on your local disk will be removed from Shopify. Any files that are both on your local disk and Shopify will be updated. Lastly any files that are only on your local disk will be upload to Shopify.
- `sns push:force`: An alias for themekit's `theme replace --force`. The same as `sns push` except it will also disable version checking and force all changes.
- `sns package`: Zip theme for uploading to Shopify store.

## Webpack Config Includes:

- Webpack 4
- Hot Reloading
- Babel
- Flow
- Eslint
- Scss, CSS
- Webpack Dev Server + BrowserSync

## Creating a trusted local SSL certificate

We recommend doing this so your `https` requests aren't blocked. Please not that this only works in macOS. You can find the orignal instructions for this [here](https://github.com/Shopify/slate/wiki/How-to-create-a-trusted-local-SSL-certificate).

1.  Copy and paste the command below into your terminal to navigate to your home directory, create a folder called _.localhost_ssl_, and navigate to that folder:

```
cd && mkdir .localhost_ssl && cd .localhost_ssl
```

2.  Copy and paste the command below to generate a new SSL certificate and key:

```
openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout server.key \
    -new \
    -out server.crt \
    -subj /CN=localhost \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:localhost')) \
    -sha256 \
    -days 3650
```

3.  Open the current folder by entering `open .` in your terminal, and double-click on the _server.crt_ file.

4.  The Keychain Access app will open. Click _Add Certificate_

5.  In the side navigation column of the Keychain Access app, in the _Category_ panel, click _Certificates_ and double click the _localhost_ certificate from the list of certificates that was just created.

6.  Once the window has opened, open the _Trust_ accordion panel.

7.  Update the _Secure Sockets Layer (SSL)_ value to _Always Trust_.

8.  Close the window and you will be prompted to input your password to save your changes.

9.  Your device is now all set up to trust https://localhost

## Notes

- If you are using Chrome and are getting a _WDS Disconnected!_ message in your console, be sure to enable the "Allow invalid certificates for resources loaded from localhost." in Chrome by going to [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost)
- If you're used to using Themekit you may notice that the Preview Bar is no longer visible. Our personal opinion is that it's visibliy in the way when developing. However, you'll still be able to see if you're previewing a theme via a [Shopnsync] message displayed in the console.

## Why Shopnsync (why not Slate)?

Shopnsync was inspired by Slate, and we are very grateful to the work the Slate team does. In the end however, we found Slate didn’t mesh well with our workflow for a couple of reasons.

Slate is a zero-config setup, but extending or modifying that config wasn’t possible pre-beta and documentation for doing so now is lacking. Not having to worry about configuration is nice, and we believe in the zero-config setup. However, not at the expense of extending or customizing that configuration. As developers we understand that while many of our projects share a lot of the same requirements, each project is a little different. As such, we put the configs that Shopnsync uses at your fingertips.

In the same vein as theme configuration is installing Shopify Apps. We like the ability to use Shopify apps, and to be able to install them at any stage of development. Sometimes apps need to inject code into different templates. Because your theme is entirely generated from source when using Slate, it makes modifying any code on Shopify a frustrating process. We found the round trip of running a Slate build, pulling the theme from Shopify into a different directory, diffing those changes, copying those differences into the src files, then recompiling and uploading that theme to Shopify to be tedious.

Overall, we think Slate is a great tool and it is a good fit for a lot of developers. It just doesn’t go well with our workflow, and think there may be other devs out there who feel the same need for something more configurable. So, if you want a modern developer workflow building Shopify themes that makes using Shopify Apps a breeze, and with full config customization, look no further.

### Disclaimers

- Shopnsync is currently in beta and is open-source. If you find any bugs or have any feedback please let us know on [github](https://github.com/SeaMonster-Studios/shopnsync).
- These opinions and assumptions were made of Slate pre-beta. However, upon looking into Slate-beta, they still appear to hold true.

## License

MIT
