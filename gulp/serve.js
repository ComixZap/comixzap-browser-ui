'use strict';

const gulp = require('gulp');
const express = require('express');

gulp.task('serve', () => {
  const app = express();
  app.use(express.static(gulp.config.destDir))
  app.listen(gulp.config.args.port)
});
