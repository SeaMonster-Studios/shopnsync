#!/usr/bin/env node
const program = require("commander");
const colors = require("colors");
//
const build = require("./options/build");
const init = require("./options/init");
const packageOption = require("./options/package");
const pullForce = require("./options/pull:force");
const pull = require("./options/pull");
const push = require("./options/push");
const pushForce = require("./options/push:force");
const start = require("./options/start");

async function initSns() {
  program
    .version("1.0.0-beta.7", "-v, --version")
    .option(
      "init",
      "Copy extendable config files: webpack, package.json, config.yml, etc."
    )
    .option("start", "Start shopnsync development server.")
    .option(
      "build",
      "Bundles your assets and places them in the `assets` directory of your theme. It also uploads all file changes to Shopify."
    )
    .option(
      "pull",
      "An alias for themekit's `theme download`. It will download the entire theme from shopify to your local machine."
    )
    .option(
      "pull:force",
      "An alias for themekit's `theme download --force`. The same as `sns pull` except it will also disable version checking and force all changes."
    )
    .option(
      "push",
      "An alias for themekit's `theme replace`. This will completely replace what is on Shopify with what is in your current project directory. This means that any files that are on Shopify but are not on your local disk will be removed from Shopify. Any files that are both on your local disk and Shopify will be updated. Lastly any files that are only on your local disk will be upload to Shopify."
    )
    .option(
      "push:force",
      "An alias for themekit's `theme replace --force`. The same as `sns push` except it will also disable version checking and force all changes."
    )
    .option("package", "Zip theme for uploading to Shopify store.")
    .option("zip", "alias for pacakge")
    .parse(process.argv);

  if (program.init) {
    init();
  }
  if (program.start) {
    start();
  }
  if (program.build) {
    build();
  }
  if (program.pull) {
    pull();
  }
  if (program["pull:force"]) {
    pullForce();
  }

  if (program.push) {
    push();
  }
  if (program["push:force"]) {
    pushForce();
  }
  if (program.package || program.zip) {
    packageOption();
  }
}

initSns().catch(error => {
  console.error(`[${colors.blue("Shopnsync")}] ${colors.red(error)}`);
});
