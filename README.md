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
        .pipe(jst({
                cmd : true,//cmd amd
                output: "html",//指定为html时，返回html片段，不指定时，返回可执行函数
                prettify : true,//压缩为一行
                namespace : false,
                //设置underscore.js template分割符为{{ }}
                evaluate: /##([\s\S]+?)##/g,
                interpolate: /\{\{(.+?)\}\}/g,
                escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
				//设置分割符 over
            }
        ))
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ['jst']);
```

Note: This code is a gulp-jst revision
-------

### jst(options)

`gulp-jst` accepts the [same _.template options](http://lodash.com/docs#template) as the lodash library.
