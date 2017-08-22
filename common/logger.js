const path = require('path');
const Tracer = require('tracer');
const config = require('../config');

let opts = {
  format: "{{timestamp}} <{{title}}> (in {{file}}:{{line}}) {{message}}",
  preprocess: function(data) {
    data.title = data.title.toUpperCase();

    // setting the {{file}} to be relative path
    let stacklist = (new Error()).stack.split('\n').slice(4);
    let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    let filePath = (stackReg.exec(stacklist[0]))[2];
    data.file = '/' + path.relative(config.appRoot, filePath);
  }
}

module.exports = Tracer.console(opts);