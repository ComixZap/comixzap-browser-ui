'use strict';

var $ = require('jquery');
var Hogan = require('hogan');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');
var UrlBuilder = require('../util/url-builder.js');

module.exports = klass(EventEmitter).extend({
  initialize: function (selector) {
    this.$root = $(selector);
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
      } else {
          self.emit(action);
          self.hide();
      }
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
});
