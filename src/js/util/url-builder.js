'use strict';

var config = require('config');

var API_ROOT = config.api_root || '';
var FILES_URL = '/file-list';
var PAGES_URL = '/comic/list';
var IMAGE_URL = '/comic/image';

var UrlBuilder = module.exports = {
  getFileListUrl: function (path) {
    return API_ROOT + FILES_URL + UrlBuilder.objectToQueryString({file: path}, '?');
  },
  getComicPagesUrl: function (path) {
    return API_ROOT + PAGES_URL + UrlBuilder.objectToQueryString({file: path}, '?');
  },
  getImageFilenameUrl: function (path, filename) {
    return API_ROOT + IMAGE_URL + UrlBuilder.objectToQueryString({file: path, extract_file: filename}, '?');
  },
  getImageOffsetUrl: function (path, offset) {
    return API_ROOT + IMAGE_URL + UrlBuilder.objectToQueryString({file: path, offset: offset}, '?');
  },
  objectToQueryString: function (obj, prefix) {
    var str,
      groups = [],
      prefix = prefix || '';
    for (var x in obj) {
      groups.push(encodeURIComponent(x) + '=' + encodeURIComponent(obj[x]));
    }
    if (groups.length < 1) {
      return '';
    }
    return prefix + groups.join('&');
  }
};
