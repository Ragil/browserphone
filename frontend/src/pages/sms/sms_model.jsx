import $ from 'jquery';
import _ from 'lodash';
import gapi from 'src/common/gapi';
import env from 'env';
import moment from 'moment';


class Message {
  constructor({message, isSelf}) {
    _.extend(this, message);
    this.isSelf = isSelf;
  }
}

class Conversation {
  constructor(conversation) {
    this.size = conversation.size;
    this.otherNumber = conversation.other_number;
    this.messages = _.map(conversation.messages, (message) => {
      return new Message({
        message : message,
        isSelf : message.from !== this.otherNumber
      });
    }, this);
    this.latestMessage = _.last(this.messages);
  }

  addNewMessages(newMessages) {
    this.size += newMessages.length;
    this.messages = this.messages.concat(newMessages);
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
    this.lastLoaded = 0;
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
        since_epoch : this.lastLoaded
      },
      username : user,
      password : password,
      beforeSend: function(req) {
        req.setRequestHeader('Authorization',
            'Basic ' + btoa(user + ':' + password));
      }
    }).done(this.onNewData.bind(this));

    this.lastLoaded = moment().unix() * 1000;
  }

  onNewData(data, status, jqXHR) {
    let newConversations = _.map(data.conversations, (convo) => {
      return new Conversation(convo);
    });

    // merge conversations
    _.each(newConversations, (newConvo) => {
      let existingConvo = _.find(this.conversations, (convo) => {
        return newConvo.otherNumber === convo.otherNumber;
      });
      if (existingConvo) {
        existingConvo.addNewMessages(newConvo.messages);
      } else {
        this.conversations.push(newConvo);
      }
    }, this);

    // sort by newest at the top
    this.conversations = _.sortBy(this.conversations, (convo) => {
      return -1 * convo.latestMessage.date_created
    });

    _.each(this.fetchCallbacks.concat(this.changeCallbacks), (cb) => {
      cb(this.conversations);
    });
    this.fetchCallbacks = [];

    this.loading = false;
    this.loaded = true;
  }

  sendMessage({from, to, body}) {
    let user = 'google-token';
    let password = gapi.auth.getToken().access_token;

    $.ajax({
      url : env.service.sms,
      method : 'POST',
      data : {
        from : from,
        to : to,
        body : body
      },
      username : user,
      password : password,
      beforeSend: function(req) {
        req.setRequestHeader('Authorization',
            'Basic ' + btoa(user + ':' + password));
      }
    }).done(this.onNewData.bind(this));
  }
}

let messages = new AllMessages();

let pollMessages = () => {
  if (messages.loaded && !messages.loading &&
      ((moment().unix() * 1000) - messages.lastLoaded) > 30000) {
    console.log('reloading');
    messages.loaded = false;
    messages.fetch({callback : (() => {}) });
  }
}

window.setInterval(pollMessages, 1000);


export default messages
