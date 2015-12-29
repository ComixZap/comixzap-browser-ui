'use strict';

const gulp = require('gulp');
const postcss = require('gulp-postcss');
const precss = require('precss');
const csswring = require('csswring');
const autoprefixer = require('autoprefixer');
const cssmin = require('gulp-cssmin');

gulp.task('css', function () {
  return gulp.src(gulp.config.asset('css/main.css'))
    .pipe(postcss([
      precss,
      autoprefixer,
      csswring
    ]))
    .pipe(gulp.dest(gulp.config.dest('assets/css')));
});
