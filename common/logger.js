const path = require('path');
const Tracer = require('tracer');
const config = require('../config');

let opts = {
  level: config.logLevel,
  format: "{{timestamp}} <{{title}}> ({{file}}:{{line}}) {{message}}",
  preprocess: function(data) {
    data.title = data.title.toUpperCase();

    // Stack trace format :
    // https://github.com/v8/v8/wiki/Stack%20Trace%20API
    let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

		// get call stack, and analyze it
		// get file and line number
    let stacklist = (new Error()).stack.split('\n').slice(4);
    let matched = stackReg.exec(stacklist[0]) || stackReg2.exec(stacklist[0]);
    let filePath = matched[2];

    // set the {{file}} to be relative path
    data.file = '/' + path.relative(config.appRoot, filePath);
  }
}

module.exports = Tracer.console(opts);