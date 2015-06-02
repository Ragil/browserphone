import $ from 'jquery';
import _ from 'lodash';
import gapi from 'src/common/gapi';
import env from 'env';


class Message {
  constructor(message) {
    _.extend(this, message);
  }
}

class Conversation {
  constructor(conversation) {
    this.size = conversation.size;
    this.otherNumber = conversation.other_number;
    this.messages = _.map(conversation.messages, (message) => {
      return new Message(message);
    });
    this.latestMessage = _.last(this.messages);
  }
}

class AllMessages {
  constructor() {
    this.conversations = [];
    this.changeCallbacks = [];
    this.fetchCallbacks = [];
    this.loaded = false;
    this.loading = false;
  }

  onChange(callback) {
    this.changeCallbacks.push(callback);
  }
  offChange(callback) {
    this.changeCallbacks = _.remove(this.changeCallbacks, (cb) => {
      return cb === callback;
    });
  }

  fetch({ callback }) {
    if (this.loaded) {
      callback(this.conversations);
    } else {
      if (callback) {
        this.fetchCallbacks.push(callback);
      }

      if (!this.loading) {
        this._fetchData();
      }
    }
  }

  findByConversation(otherNumber) {
    return _.find(this.conversations, (convo) => {
      return convo.otherNumber === otherNumber;
    });
  }

  _fetchData() {
    this.loading = true;

    let user = 'google-token';
    let password = gapi.auth.getToken().access_token;

    $.ajax({
      url : env.service.sms,
      data : {
        number : env.phoneNumber,
        since_epoch : 0
      },
      username : user,
      password : password,
      beforeSend: function(req) {
        req.setRequestHeader('Authorization',
            'Basic ' + btoa(user + ':' + password));
      }
    }).done(this.onNewData.bind(this));
  }

  onNewData(data, status, jqXHR) {
    this.conversations = _.map(data.conversations, (convo) => {
      return new Conversation(convo);
    });

    _.each(this.fetchCallbacks.concat(this.changeCallbacks), (cb) => {
      cb(this.conversations);
    });
    this.fetchCallbacks = [];

    this.loading = false;
    this.loaded = true;
  }
}


export default new AllMessages();
