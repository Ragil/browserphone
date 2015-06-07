import $ from 'jquery';
import _ from 'lodash';
import env from 'env';
import gapi from '../gapi';


class Contact {
  constructor(entry) {
    this.data = entry;
    this.id = entry['id']['$t'].substring(entry['id']['$t'].lastIndexOf('/') + 1);

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

          return p.uri.replace('tel:', '').replace(/-/g, '');
        }).filter((n) => {
          return n.length > 0;
        }).value();
  }

  getIdentity(number) {
    let name = number;
    if (this.fullname) {
      name = this.fullname;
      if (this.phones.length > 1) {
        name = this.fullname + ' (' + number + ')';
      }
    }
    return name;
  }
}

class Contacts {
  constructor() {
    this.data = [];
    this.entries = [];
    this._callbacks = [];
    this.maxResult = 10000;
    this.finished = false;
    this.loading = false;
  }

  fetch(callback) {
    this._fetch({
      url : env.service.contacts,
      callback : callback
    })
  }

  findById(id) {
    return _.find(this.entries, (contact) => {
      return contact.id === id;
    });
  }

  findByNumber(number) {
    return _.find(this.entries, (contact) => {
      let found = _.find(contact.phones, (phone) => {
        return phone === number;
      });

      return !!found;
    });
  }

  _fetch(opts) {
    if (!this.finished) {
      if (opts.callback) {
        this._callbacks.push(opts.callback);
      }

      if (this.loading) {
        return;
      }
      this.loading = true;

      let user = 'google-token';
      let password = gapi.auth.getToken().access_token;

      $.ajax({
        url: opts.url,
        username : user,
        password : password,
        beforeSend: function(req) {
          req.setRequestHeader('Authorization',
              'Basic ' + btoa(user + ':' + password));
        }
      }).done(this._onData.bind(this));
    } else if (opts.callback) {
      opts.callback(this.entries);
    }
  }

  _onData(data) {
    this.loading = false;

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
