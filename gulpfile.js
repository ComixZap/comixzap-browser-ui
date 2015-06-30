'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var postcssNested = require('postcss-nested');
var cssmin = require('gulp-cssmin');

var livereload = require('gulp-livereload');

var isProduction = process.env.APPLICATION_ENVIRONMENT === 'production';

gulp.task('js', function() {
    return browserify({
        entries: ['./src/js/main.js'],
        debug: true
    })
        .require(__dirname + '/config.json', {expose: 'config'})
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe( gulpIf(!isProduction, sourcemaps.init({loadMaps: true})) )
        .pipe( gulpIf(isProduction, uglify()) )
        .pipe( gulpIf(!isProduction, sourcemaps.write('./')) )
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('css', function () {
    return gulp.src('./src/css/main.css')
        .pipe(postcss([
          postcssImport,
          postcssNested,
          autoprefixer
        ]))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('icons', function () {
    return gulp.src('./src/icomoon/fonts/*')
        .pipe(gulp.dest('./dist/css/fonts'));
});

gulp.task('copy', function () {
    return gulp.src('./src/*')
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('./src/index.html', ['copy']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/css/**/*.css', ['css']);
    gulp.watch('./dist/**').on('change', livereload.changed);
});

gulp.task('build', ['copy', 'icons', 'css', 'js']);

gulp.task('default', ['build', 'watch']);
