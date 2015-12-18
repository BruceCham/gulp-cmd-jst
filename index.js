'use strict';

var compile = require('lodash').template;
var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-cmd-jst';

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
          fileContent = fileContent.replace(new RegExp('\n', 'g'), '')
            .replace(/\\\\n+/gi, 'gulpjstvarbc9end')
            .replace(/\\n+/gi, '')
            .replace(/gulpjstvarbc9end/gi, '\\n')

            .replace(/\\\\t+/gi, 'gulpjstvarbc9end')
            .replace(/\\t+/gi, '')
            .replace(/gulpjstvarbc9end/gi, '\\t')

            .replace(/\\\\r+/gi, 'gulpjstvarbc9end')
            .replace(/\\r+/gi, '')
            .replace(/gulpjstvarbc9end/gi, '\\r')
            
            .replace(new RegExp('\\s{2,}','g'),'');
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
        this.emit('error', new PluginError(PLUGIN_NAME, 'compile error:'+file.path));
      }

      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported.'+file.path));
      return cb();
    }
  });

  return stream;
};
