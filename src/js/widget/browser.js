'use strict';

var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');
var doT = require('dot');
var Promise = require('bluebird');

module.exports = klass(EventEmitter).extend({
    inhibitScroll: false,
    initialize: function (selector)
    {
        this.$root = $(selector);
        this.$currentElement = null;
        this.initializeTemplates();
        this.bindEvents();
    },
    setDao: function (dao)
    {
        this.dao = dao;
    },
    start: function ()
    {
        return this.getFiles('');
    },
    bindEvents: function ()
    {
        var self = this;
        this.$root.on('click', 'a', function (evt) {
            var $this = $(this);
            var $element = $this.parent();
            if ($element.attr('data-expanded')) {
                $element.removeAttr('data-expanded');
                var $directoryChildren = $element.children('.directory-children');
                $directoryChildren.slideUp();
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            } else if ($element.attr('data-filetype') == 'directory') {
                //check if hash matches, otherwise let the hashchange work
                var path = $element.attr('data-path');
                if (window.location.hash === '#!' + path) {
                    self.getFiles(path);
                }
            }
            self.inhibitScroll = true;
        });
    },
    selectFile: function (path) {
        if (path) {
            var $element = $('[data-path="'  + path + '"]');
            if (!$element.length) {
                return;
            }
        } else {
            var $element = this.$root.find('.browser-root');
        }
        if (this.$currentElement) {
            this.$currentElement.removeClass('active');
        }
        this.$currentElement = $element;
        $element.addClass('active');

        return $element;
    },
    getFiles: function (path)
    {
        var self = this;
        var deferred = Promise.pending();
        var $element = self.selectFile(path);
        if (!$element) {
            deferred.reject();
            return deferred.promise;
        }
        var $directoryChildren = $element.children('.directory-children');
        $directoryChildren.empty();
        $directoryChildren.hide();
        self.dao.getFileList(path, function (err, directory, files) {
            if (err) return deferred.reject();
            files.forEach(function (fileData) {
                fileData.path = [directory, fileData.filename].join('/');
                $directoryChildren.append(self.browserRowTemplate(fileData));
                $element.attr('data-expanded', true);
            });
            $directoryChildren.slideDown();
            return deferred.resolve();
        });
        return deferred.promise;
    },
    scrollToActive: function () {
        var activeOffset = this.$currentElement.offset().top;
        var rootOffset = this.$root.offset().top;
        var totalOffset = activeOffset - rootOffset + this.$root.scrollTop();
        this.$root.scrollTop(totalOffset);
    },
    initializeTemplates: function () {
        this.browserRowTemplate = doT.compile($('#cbz-reader-template-browser-row').html());
    }
});
