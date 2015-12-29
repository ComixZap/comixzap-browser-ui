'use strict';

const gulp = require('gulp');

gulp.config = require('./gulp/config.js');

require('./gulp/js.js');
require('./gulp/css.js');
require('./gulp/pages.js');
require('./gulp/files.js');
require('./gulp/watch.js');
require('./gulp/serve.js');

gulp.task('build', ['files', 'pages', 'css', 'js']);

gulp.task('default', ['build']);
