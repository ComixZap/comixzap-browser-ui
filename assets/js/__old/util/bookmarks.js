'use strict';

var Path = require('path');

var STORAGE_KEY = 'cz-bookmarks';

module.exports = {
  initialized: false,
  bookmarks: [],
  start: function () {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    try{
      var data = localStorage.getItem(STORAGE_KEY);
      this.bookmarks = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    if (!Array.isArray(this.bookmarks)) {
      this.bookmarks = [];
    }
  },
  getBookmarks: function () {
    this.start();
    return this.bookmarks;
  },
  addBookmark: function (pageHash) {
    this.start();
    var bookmark = {};
    var exists = this.bookmarks.some(function (bookmark) {
      return bookmark.url == pageHash;
    });
    if (exists) {
      return;
    }
    bookmark.url = pageHash;
    bookmark.title = Path.basename(pageHash);
    this.bookmarks.push(bookmark);
    this.saveBookmarks();
  },
  deleteBookmark: function (index) {
    this.start();
    var bookmark = this.bookmarks.splice(index, 1);
    this.saveBookmarks();
  },
  saveBookmarks: function () {
    if (!Array.isArray(this.bookmarks)) {
      return localStorage.removeItem(STORAGE_KEY);
    }
    try {
      var json = JSON.stringify(this.bookmarks);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
      console.error(e);
    }
  }
}
