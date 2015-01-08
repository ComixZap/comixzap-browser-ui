'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');

var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var livereload = require('gulp-livereload');

var isProduction = process.env.APPLICATION_ENVIRONMENT === 'production';

gulp.task('js', function() {
    return browserify({
        entries: ['./src/js/main.js'],
        debug: true
    })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe( gulpIf(!isProduction, sourcemaps.init({loadMaps: true})) )
        .pipe( gulpIf(isProduction, uglify()) )
        .pipe( gulpIf(!isProduction, sourcemaps.write('./')) )
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('css', ['copy'], function () {
    return gulp.src('./src/css/main.scss')
        .pipe(sass({
            errLogToConsole: true,
            sourceComments : 'normal'
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

/*
gulp.task('icomoon', function () {
    return gulp.src('./src/icomoon/**')
        .pipe(gulp.dest('./dist/src/icomoon'));
});
*/

gulp.task('icons', function () {
    return gulp.src('./src/icomoon/fonts/*')
        .pipe(gulp.dest('./dist/css/fonts'));
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('./src/index.html', ['copy']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/css/**/*.scss', ['css']);
    gulp.watch('./dist/**').on('change', livereload.changed);
});

gulp.task('copy', ['icons'], function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['copy', 'css', 'js']);

gulp.task('default', ['build', 'watch']);
