'use strict';

var $ = require('jquery');
var klass = require('klass');
var EventEmitter = require('events').EventEmitter;
var fullscreen = require('fullscreen')
var ToolbarWidget = require('../widget/toolbar.js');
var BrowserWidget = require('../widget/browser.js');
var PagesWidget = require('../widget/pages.js');
var ViewerWidget = require('../widget/viewer.js');
var OverlayWidget = require('../widget/overlay.js');
var Promise = require('bluebird');
var Bookmarks = require('../util/bookmarks.js');

var MODE_NONE    = 0;
var MODE_BROWSER = 1;
var MODE_PAGES   = 2;

module.exports = klass(EventEmitter).extend({
    fullscreen: false,
    fullscreenEl: false,
    initialize: function (config)
    {
        this.config = config || {};
        this.mode = MODE_NONE;

        this.$body = $(document.body);
        this.toolbar = new ToolbarWidget('#cbz-reader-toolbar');
        this.browser = new BrowserWidget('#cbz-reader-browser');
        this.pages   = new PagesWidget('#cbz-reader-pages');
        this.viewer  = new ViewerWidget('#cbz-reader-viewer', config);
        this.overlay = new OverlayWidget('#cbz-reader-overlay');
        this.fullscreenEl = fullscreen(document.body);
        this.bindEvents();
        this.start();
    },
    bindEvents: function ()
    {
        window.addEventListener('hashchange', this.onHashChange.bind(this));

        this.toolbar.on('click', this.onToolbarClick.bind(this));
        this.pages.on('page', this.onPage.bind(this));
        this.pages.on('update', this.onPageUpdate.bind(this));
        this.pages.on('click', this.onPageClick.bind(this));
        this.overlay.on('reload', this.onReload.bind(this));
        this.overlay.on('fullscreen', this.toggleFullscreen.bind(this));
        this.overlay.on('bookmark', this.onBookmark.bind(this));
    },
    onPageClick: function () {
        this.inhibitBrowserScroll();
    },
    onPage: function (data)
    {
        this.viewer.loadPage(data);
    },
    onPageUpdate: function(pages, page)
    {
        this.toolbar.togglePrevious(page != 1);
        this.toolbar.toggleNext(page <= pages - 1);
    },
    onReload: function () {
        this.setMode(MODE_BROWSER);
        this.browser.start();
    },
    onBookmark: function () {
        Bookmarks.addBookmark(window.location.hash);
        this.overlay.emit('bookmarks-updated');
    },
    onToolbarClick: function (action)
    {
        if (action == 'toggle-browser') {
            if (this.mode == MODE_BROWSER) {
                this.setMode(MODE_NONE)
            } else {
                this.setMode(MODE_BROWSER)
            }
        } else if (action == 'toggle-pages') {
            if (this.mode == MODE_PAGES) {
                this.setMode(MODE_NONE)
            } else {
                this.setMode(MODE_PAGES)
            }
        } else if (action == 'next-page') {
            this.pages.nextPage();
        } else if (action == 'previous-page') {
            this.pages.previousPage();
        } else if (action == 'overlay') {
            this.overlay.show();
        }
    },
    toggleFullscreen: function ()
    {
        if (this.fullscreen) {
            this.fullscreen = false;
            this.fullscreenEl.release();
        } else {
            this.fullscreen = true;
            this.fullscreenEl.request();
        }
    },
    onHashChange: function ()
    {
        var self = this;
        return this.hashWalk().then(function () {
            self.conditionalScroll();
        });
    },
    hashWalk: function (level) {
        var hash = window.location.hash;
        var fileMatch = /^#\!(.+)::(.+)$/.exec(hash);

        if (fileMatch) {
            var path = fileMatch[1];
            var page = fileMatch[2];
        } else {
            var pathMatch = /^#\!(.+)$/.exec(hash);
            if (pathMatch) {
              var path = pathMatch[1];
            } else {
              path = '';
            }
        }
        if (this.browser.selectFile(path)) {
            if (page) {
                if (this.mode === MODE_BROWSER) {
                    this.setMode(MODE_PAGES);
                }
                this.pages.loadPage(path, page);
                return Promise.resolve();
            }
        }
        this.setMode(MODE_BROWSER);
        return this.directoryWalk(path, level)
    },
    directoryWalk: function (fullPath, level) {
        if (!level) {
            level = 1;
        }
        var deferred = Promise.pending();
        var self = this;
        var pathSections = fullPath.split(/\//g);

        //find the deepest level
        for (var i = pathSections.length ; i > level ; i--) {
            var path = pathSections.slice(0, i).join('/');
            var $element = this.browser.selectFile(path);
            if ($element) {
                if ($element.attr('data-filetype') === 'directory') {
                    this.browser.getFiles(path).then(function () {
                        self.hashWalk(i).then(function () {
                            deferred.resolve()
                        });
                    });
                }
                return deferred.promise;
            }
        }
        deferred.resolve();
        return deferred.promise;
    },
    start: function()
    {
        var self = this;
        this.setMode(MODE_BROWSER);
        this.browser.start().then(function () {
            //TODO: can we do this without the timeout?
            setTimeout(function () {
                return self.onHashChange();
            }, 200);
        });
    },
    inhibitBrowserScroll: function () {
        this.browser.inhibitScroll = true;
    },
    conditionalScroll: function () {
        if (this.browser.inhibitScroll) {
            this.browser.inhibitScroll = false;
            return;
        }
        this.browser.scrollToActive();
    },
    setMode: function(mode)
    {
        if (mode === MODE_BROWSER) {
            this.$body.removeClass('pages').addClass('browser');
        } else if (mode === MODE_PAGES) {
            this.$body.removeClass('browser').addClass('pages');
        } else if (mode === MODE_NONE) {
            this.$body.removeClass('pages browser');
        }
        this.mode = mode;
    }
});
