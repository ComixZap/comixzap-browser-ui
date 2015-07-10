'use strict';

var $ = require('jquery');
var klass = require('klass');
var UrlBuilder = require('./url-builder.js');

$.support.cors = true;

module.exports = {
    getFileList: function (path, cb)
    {
        $.ajax({
            url: UrlBuilder.getFileListUrl(),
            data: {directory: path},
            success: function (returnValue) {
                if (returnValue.status === 0) {
                    cb(null, path, returnValue.data);
                } else {
                    cb(new Error('Bad Status'));
                }
            },
            error: function (err) {
                cb(err);
            }
        });
    },
    getComicPages: function (path, cb)
    {
        $.ajax({
            url: UrlBuilder.getComicPagesUrl(),
            data: {file: path},
            success: function (returnValue) {
                if (returnValue.status === 0) {
                    cb(null, path, returnValue.data);
                } else {
                    cb(new Error('Bad Status'));
                }
            },
            error: function (err) {
                cb(err);
            }
        });
    }
}
