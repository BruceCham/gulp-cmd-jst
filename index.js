'use strict';

var compile = require('lodash').template;
var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-jst';

module.exports = function(options) {
  var options = options || {};
  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isBuffer()) {
      try {
        var fileContent = compile(file.contents.toString(), null, options).source;
        if( options.prettify){
          fileContent = fileContent.replace(new RegExp('\n', 'g'), '');
        }
        if((options.cmd || options.amd) && options.namespace === false){
          if(options.output === "html"){
            fileContent = 'return ' + fileContent + '()';
          }else{
            fileContent = 'return ' + fileContent;
          }
        }
        if(fileContent.length > 1 && (options.cmd || options.amd)){
          var prarms = options.cmd ? "require, exports, module":"";
          fileContent = "define(function("+ prarms +"){" + fileContent + "});";
        }
        file.contents = new Buffer(fileContent);
        file.path = gutil.replaceExtension(file.path, ".js");
      } catch(err) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
      }

      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported.'));
      return cb();
    }
  });

  return stream;
};
