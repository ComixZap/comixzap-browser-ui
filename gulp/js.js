'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');

gulp.task('js', function () {
  return browserify({
    debug: !gulp.config.isProduction,
    entries: [gulp.config.asset('js/main.js')],
    transform: [
      [
        'babelify', {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-es2015-modules-commonjs', 'transform-decorators-legacy']
        }
      ]
    ]
  })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulpIf(!gulp.config.isProduction, sourcemaps.init({loadMaps: true})))
    .pipe(gulpIf(gulp.config.isProduction, uglify()))
    .pipe(gulpIf(!gulp.config.isProduction, sourcemaps.write('./')))
    .pipe(gulp.dest(gulp.config.dest('assets/js/')));
});

