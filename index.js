'use strict';

var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-cmd-jst';

module.exports = function(options) {
  var options = _.extend({
      namespace: 'JST',
      templateSettings: {},
      processContent: function (src) { return src; },
      processName: function(name){return name;}
  },options);

  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isBuffer()) {
      try {
        var fileContentSrc = options.processContent( file.contents.toString() );
        var fileContent = _.template( fileContentSrc , null, options.templateSettings ).source;
        if( options.prettify){
          fileContent = fileContent.replace(new RegExp('\n', 'g'), '');
        }
        // filename = processName(filepath);
        if(options.cmd || options.amd){
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
