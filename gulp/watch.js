'use strict';

const gulp = require('gulp');
const livereload = require('gulp-livereload');

gulp.task('watch', function () {
  gulp.watch(gulp.config.asset('js/**/*'), ['js']);
  gulp.watch(gulp.config.asset('css/**/*'), ['css']);
  gulp.watch(gulp.config.asset('pages/**/*'), ['pages']);

  livereload.listen();
  gulp.watch(gulp.config.dest('**')).on('change', livereload.changed);
});
