'use strict';

const gulp = require('gulp');

gulp.task('icons', function () {
  return gulp.src(gulp.config.asset('icomoon/fonts/*'))
    .pipe(gulp.dest(gulp.config.dest('assets/css/fonts')));
});

gulp.task('copy', function () {
  return gulp.src(gulp.config.asset('docroot/**/*'))
    .pipe(gulp.dest(gulp.config.destDir));
});


gulp.task('images', function () {
  return gulp.src(gulp.config.asset('./src/images/**/*'))
    .pipe(gulp.dest(gulp.config.dest('assets/images')));
});

gulp.task('files', ['icons', 'copy', 'images']);
