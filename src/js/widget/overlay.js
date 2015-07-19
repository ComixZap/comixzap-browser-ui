'use strict';

var $ = require('jquery');
var Hogan = require('hogan');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');
var UrlBuilder = require('../util/url-builder.js');
var Bookmarks = require('../util/bookmarks.js');

module.exports = klass(EventEmitter).extend({
  initialize: function (selector) {
    this.$root = $(selector);
    this.$bookmarkList = this.$root.find('.bookmark-list');
    this.initializeTemplates();
    this.renderBookmarks();
    this.bindEvents();
  },
  bindEvents: function () {
    var self = this;
    this.$root.on('click', 'a[data-action]', function () {
      var action = this.getAttribute('data-action');
      if (action == 'close') {
          return self.hide();
      } else if (action == 'set-root') {
          self.saveApiRoot();
          return self.hide();
      } else if (action == 'delete-bookmark') {
          var index = this.getAttribute('data-index');
          Bookmarks.deleteBookmark(+index);
          self.renderBookmarks();
      } else {
          self.emit(action);
          self.hide();
      }
    });
    this.$root.on('click', '.bookmark-link', function () {
        self.hide();
    });
    this.on('bookmarks-updated', function () {
        self.renderBookmarks();
    });
  },
  saveApiRoot: function () {
      var root = this.$root.find('input[name=api-root]').val();
      UrlBuilder.setApiRoot(root);
      this.emit('reload');
  },
  show: function () {
      this.$root.show();
  },
  hide: function () {
      this.$root.hide();
  },
  renderBookmarks: function () {
      var self = this;
      this.$bookmarkList.empty();
      Bookmarks.getBookmarks().forEach(function (bookmark, index) {
          var context = $.extend({}, bookmark, {index: index});
          console.log(context);
          self.$bookmarkList.append(self.bookmarkRowTemplate.render(context));
      });
  },
  initializeTemplates: function () {
      this.bookmarkRowTemplate = Hogan.compile($('#cz-template-bookmark-row').html());
  }
});
