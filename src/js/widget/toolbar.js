'use strict';

var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');

module.exports = klass(EventEmitter).extend({
    initialize: function (selector)
    {
        this.$root = $(selector);
        this.$previousBtn = this.$root.find('[data-action="previous-page"]');
        this.$nextBtn = this.$root.find('[data-action="next-page"]');
        this.$fullscreenBtn = this.$root.find('[data-action="fullscreen"]');
        this.fullscreen = false;

        this.bindEvents();
        this.toggleFullscreenBtn();
    },
    toggleFullscreenBtn: function ()
    {
        if (document.body.requestFullscreen) {
            this.$fullscreenBtn.removeClass('hidden');
        }
    },
    bindEvents: function ()
    {
        var self = this;
        this.$root.on('click', 'a', function (e) {
            var action = $(this).attr('data-action');
            if (action) {
                self.emit('click', action);
            }
        });

    },
    toggleNext: function(state)
    {
        this.$nextBtn.attr('disabled', !state);
    },
    togglePrevious: function(state)
    {
        this.$previousBtn.attr('disabled', !state);
    }
});
