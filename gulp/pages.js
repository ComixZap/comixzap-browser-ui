'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');

gulp.task('pages', function () {
  gulp.src(gulp.config.asset('pages/**/*'))
    .pipe(jade({locals: gulp.config}))
    .pipe(gulp.dest(gulp.config.destDir));
});

