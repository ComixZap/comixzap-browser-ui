'use strict';

var config = require('config');
var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');
var path = require('path');
var Hogan = require('hogan');
var Dao = require('../util/dao.js');
var UrlBuilder = require('../util/url-builder.js');
var Promise = require('bluebird');

module.exports = klass(EventEmitter).extend({
  currentFile: null,
  page: null,
  lastPage: null,
  $currentElement: null,
  initialize: function (selector) {
    this.currentFile = null;
    this.$root = $(selector);
    this.$preload = this.$root.find('.preload');
    this.$currentFileList = this.$root.find('.current-file-list');
    this.$currentFileTitle = this.$root.find('.current-file-title')
    this.initializeTemplates();
    this.bindEvents();
  },
  bindEvents: function () {
    var self = this;
    this.$root.on('click', 'a', function (e) {
      self.emit('click');
    });

    this.$preload.on('click', function (e) {
      e.preventDefault();
      self.preloadThumbs();
    });
  },
  setCurrentFile: function (filename) {
    this.currentFile = filename;
    this.$currentFileTitle.text(path.basename(filename));
  },
  loadPage: function (filename, page) {
    var self = this;
    if (this.currentFile != filename) {
      this.displayLoading();
      Dao.getComicPages(filename, function (err, path, pages) {
        if (err) return self.displayError(err);
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
  displayLoading: function () {
    this.$currentFileTitle.html(this.pageLoadingTemplate.render());
    this.$currentFileList.empty();
  },
  displayError: function (err) {
    // TODO
    this.$currentFileTitle.html(err.message);
  },
  updatePages: function (path, pages) {
    var self = this;
    this.lastPage = pages.length;
    this.$currentFileList.empty();
    this.$currentFileList.scrollTop(0);
    pages.forEach(function (page, index) {
      var data = $.extend({}, page, {index: index + 1, path: path});
      data.fileOffset = ''+data.fileOffset;
      data.thumbs_enabled = config.enable_thumbs;
      self.$currentFileList.append(self.pageRowTemplate.render(data));
    });
  },
  selectPage: function (page) {
    if (this.$currentElement) {
      this.$currentElement.removeClass('active');
    }
    this.page = +page;
    var $pageElement = this.$currentFileList.find('li').eq(page - 1);
    $pageElement.addClass('active');
    var filename = $pageElement.attr('data-filename');
    this.$currentElement = $pageElement;
    if (config.enable_thumbs) {
      this.loadThumb($pageElement).catch(function (err) {
        // TOOO: Handle thumbnail errors
      });
    }
    this.emit('page', {path: this.currentFile, filename: filename});
  },
  preloadThumbs: function () {
    var self = this;
    var currentFile = this.currentFile;
    var promise = Promise.resolve();
    this.$currentFileList.find('li').each(function (index, element) {
      var $element = $(element);
      promise = promise.then(function () {
        if (self.currentFile == currentFile) {
          return self.loadThumb($element);
        }
      });
    });

    promise.catch(function (err) {
      // TOOO: Handle thumbnail errors
    });

    return promise;
  },
  loadThumb: function ($pageElement) {
    var self = this;
    var $thumb = $pageElement.find('.page-thumb');
    var thumb = $thumb.find('img')[0];
    return new Promise(function (resolve, reject) {
      if ($thumb.hasClass('no-src')) {
        var filename = $pageElement.attr('data-filename');
        thumb.src = UrlBuilder.getImageFilenameUrl(self.currentFile, filename);
        thumb.addEventListener('load', function (e) {
          $thumb.removeClass('no-src');
          resolve();
        });
        thumb.addEventListener('error', function (e) {
          reject(new Error('Thumbnail image `' + thumb.src + '` could not be loaded'));
        });
      } else {
        resolve();
      }
    });
  },
  nextPage: function () {
    if (this.currentFile && this.page <= this.lastPage - 1) {
      window.location.hash = '#!' + this.currentFile + '::' + (this.page + 1);
    }
  },
  previousPage: function () {
    if (this.currentFile && this.page > 1) {
      window.location.hash = '#!' + this.currentFile + '::' + (this.page - 1);
    }
  },
  initializeTemplates: function () {
    this.pageRowTemplate = Hogan.compile($('#cz-template-page-row').html());
    this.pageLoadingTemplate = Hogan.compile($('#cz-template-page-loading').html());
  }
});
