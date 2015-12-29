'use strict';

const path = require('path');
const yargs = require('yargs');

const config = module.exports = {};

config.args = yargs
  .string('p', 'e')
  .alias('p', 'port')
  .alias('e', 'env')
  .default('e', 'development')
  .default('p', 3003)
  .argv

config.env = process.env.APPLICATION_ENVIRONMENT || config.args.env;
config.isProduction = config.env === 'production';
config.rootDir = path.dirname(__dirname);
config.assetDir = path.join(config.rootDir, 'assets');
config.destDir = path.join(config.rootDir, 'dist');
config.asset = path.join.bind(path, config.assetDir);
config.dest = path.join.bind(path, config.destDir);

