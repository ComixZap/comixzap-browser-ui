'use strict';

import 'babel-polyfill';
import _Promise from 'es6-promise';
import _fetch from 'whatwg-fetch';

if (!global.Promise) {
  global.Promise = _Promise;
}

if (!global.fetch) {
  global.fetch = _fetch;
}

