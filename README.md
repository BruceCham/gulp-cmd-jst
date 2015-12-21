gulp-cmd-jst [![Build Status](https://travis-ci.org/brucecham/gulp-cmd-jst.svg?branch=master)](https://travis-ci.org/brucecham/gulp-cmd-jst)
========

Compile [lodash templates](http://lodash.com/docs#template) to a JST file using [gulp](https://github.com/wearefractal/gulp).

Install
-------

Install using [npm](https://npmjs.org/package/gulp-cmd-jst).

```
npm install gulp-cmd-jst --save-dev
```

Usage
-----

```js
var gulp = require('gulp');
var jst = require('gulp-cmd-jst');

gulp.task('jst', function() {
    gulp.src('input/*.html')
        .pipe(jst(
            {
                templateSettings: {
                  evaluate: /##([\s\S]+?)##/g,
                  interpolate: /\{\{(.+?)\}\}/g,
                  escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
                },
                //filter escape character
                processContent: function(src) {
                  return src.replace(/(^\s+|\s+$)/gm, '');
                },
                //compress Jst
                prettify: true, 
                //cmd: true || amd: true        
                cmd: true
            }
        ))
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ['jst']);
```

###Note: 版本 version
* `0.1.5`: the code will remove escape character from lodash when setting 'prettify: true'
* `0.1.5`: 当设置 prettify: true时，jst代码压缩为一行，并去掉lodash转义过来的字符
* `0.1.6`: change settings options

### jst(options)

`gulp-cmd-jst` accepts the [same _.template options](http://lodash.com/docs#template) as the lodash library.
