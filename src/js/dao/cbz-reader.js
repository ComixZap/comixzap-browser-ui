'use strict';

var $ = require('jquery');
var klass = require('klass');

$.support.cors = true;

module.exports = klass({
    initialize: function ()
    {
        this.comicPagesUrl = '/comic/list';
        this.fileListUrl   = '/file-list';
    },
    setApiRoot: function (apiRoot) {
        this.apiRoot = apiRoot;
    },
    setComicPagesUrl: function (url)
    {
        this.comicPagesUrl = url
    },
    setFileListUrl: function (url)
    {
        this.fileListUrl = url
    },
    getFileListUrl: function () {
        return this.apiRoot + this.fileListUrl;
    },
    getComicPagesUrl: function () {
        return this.apiRoot + this.comicPagesUrl;
    },
    getFileList: function (path, cb)
    {
        $.ajax({
            url: this.getFileListUrl(),
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
            url: this.getComicPagesUrl(),
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
});
