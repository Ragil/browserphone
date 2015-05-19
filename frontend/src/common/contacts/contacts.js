import $ from 'jquery';
import gapi from '../gapi';


class Contact {
  constructor(entry) {
    this.data = entry;

    this.fullname = entry.title ? entry.title.$t : '';

    this.primaryEmail = _.chain(entry['gd$email'])
        .filter((e) => {
          return e.primary === 'true';
        }).map((e) => {
          return e.address;
        }).value();

    this.photoLink = entry.link.length >= 4 ? entry.link[1].href : '';

    this.phones = _.chain(entry['gd$phoneNumber'])
        .map((p) => {
          if (!p.uri) {
            return p.$t;
          }

          return p.uri.replace('tel:', '');
        }).filter((n) => {
          return n.length > 0;
        }).value();
  }
}

class Contacts {
  constructor() {
    this.data = [];
    this.entries = [];
    this._callbacks = [];
    this.maxResult = 10000;
    this.finished = false;
  }

  fetch(callback) {
    this._fetch({
      url : 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&max_result=' + this.maxResult,
      callback : callback
    })
  }

  _fetch(opts) {
    if (!this.finished) {
      if (opts.callback) {
        this._callbacks.push(opts.callback);
      }

      $.ajax({
        url: opts.url,
        dataType: 'jsonp',
        data: gapi.auth.getToken()
      }).done(this._onData.bind(this));
    } else if (opts.callback) {
      window.setTimeout((() => {
        opts.callback(this.entries);
      }).bind(this), 1);
    }
  }

  _onData(data) {
    this.data.push(data);
    this.entries = this.entries.concat(_.map(data.feed.entry, (entry) => {
      return new Contact(entry);
    }));

    let nextRel = this._getNextRel(data.feed.link);
    this.finished = !nextRel;

    if (this.finished) {

      // only show entries with phone numbers
      this.entries = _.chain(this.entries)
          .filter((contact) => {
            return contact.phones.length > 0;
          }).sortBy((contact) => {
            return contact.fullname;
          }).value();

      _.each(this._callbacks, (cb) => {
        cb(this.entries);
      }, this);
      this._callbacks = [];
    } else {
      this._fetch({ url : nextRel });
    }
  }

  _getNextRel(links) {
    let next = _.find(links, (link) => {
      return link.rel === 'next';
    });
    return next ? next.href : undefined;
  }
}

export default new Contacts()
