'use strict';

var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');
var path = require('path');

module.exports = klass(EventEmitter).extend({
    currentFile: null,
    page: null,
    lastPage: null,
    $currentElement: null,
    initialize: function (selector)
    {
        this.currentFile = null;
        this.$root = $(selector);
        this.$currentFileList = this.$root.find('.current-file-list');
        this.$currentFileTitle = this.$root.find('.current-file-title')
        this.bindEvents();
    },
    setDao: function (dao)
    {
        this.dao = dao;
    },
    bindEvents: function () 
    {
        var self = this;
        this.$root.on('click', 'a', function (e) {
            self.emit('click');
        });
    },
    setCurrentFile: function (filename)
    {
        this.currentFile = filename;
        this.$currentFileTitle.text(path.basename(filename));
    },
    loadPage: function (filename, page)
    {
        var self = this;
        if (this.currentFile != filename) {
            this.dao.getComicPages(filename, function (err, path, pages) {
                if (err) return;
                self.setCurrentFile(filename);
                self.updatePages(path, pages);
                self.selectPage(page);
                self.emit('update', self.lastPage, page);
            });
        } else {
            this.selectPage(page);
            this.emit('update', this.lastPage, page);
        }
    },
    updatePages: function (path, pages)
    {
        var self = this;
        this.lastPage = pages.length;
        this.$currentFileList.empty();
        this.$currentFileList.scrollTop(0);
        pages.forEach(function (page, index) {
            self.$currentFileList.append('<li data-offset="' + page.fileOffset + '"><a href="#!' + path + '::' + (index + 1) +'"><span class="page-filename">' + page.filename + '</span></a></li>')
        });
    },
    selectPage: function (page)
    {
        if (this.$currentElement) {
            this.$currentElement.removeClass('active');
        }
        this.page = +page;
        var $pageElement = this.$currentFileList.find('li').eq(page - 1);
        $pageElement.addClass('active');
        var offset = $pageElement.attr('data-offset');
        this.$currentElement = $pageElement;
        this.emit('page', this.currentFile, offset);
    },
    nextPage: function()
    {
        if (this.currentFile && this.page <= this.lastPage - 1) {
            window.location.hash = '#!' + this.currentFile + '::' + (this.page + 1);
        }
    },
    previousPage: function()
    {
        if (this.currentFile && this.page > 1) {
            window.location.hash = '#!' + this.currentFile + '::' + (this.page - 1);
        }
    }
});
