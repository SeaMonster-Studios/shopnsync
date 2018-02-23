#!/usr/bin/env node
"use strict";

const copy = require('recursive-copy');
const cmd = require('node-cmd');

const copyOptions = {
  overwrite: true,
  dot: true,
}

copy(__dirname + '/app', './', copyOptions)
  .on(copy.events.ERROR, function(error, copyOperation) {
    console.error('Unable to copy ' + copyOperation.dest);
  })
  .then(function(results) {
    console.info('Copied shopnsync files.');
    console.info('Installing dependencies...');

    cmd.get('yarn', (error, data, stderr) => {
      console.log(data)
      console.log(stderr)
      if (error) {
        console.error(error)
      } else {
        console.log('\n\nAll done! Checkout out the ReadMe for next steps.\n')
      }
    })
  })
  .catch(function(error) {
    return console.error('Copy failed: ' + error);
  });


