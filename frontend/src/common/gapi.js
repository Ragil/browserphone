import 'src/vendor/google_client';
import _ from 'lodash';


let clientId = '663449129276-4jpakvhq4teccr59s1rtfgk9166p6ilo.apps.googleusercontent.com';
let apiKey = 'QYSsFLLL2sbFgfh33B0ylGgF';

let callbacks = [];
gapi = window.gapi || {};
gapi.onload = (callback) => {
  if (!gapi.auth) {
    callbacks.push(callback);
  } else {
    callback();
  }
};


let loggedInCallbacks = [];

gapi.onLoggedIn = (callback) => {
  if (!gapi.isLoggedIn()) {
    loggedInCallbacks.push(callback);
  } else {
    window.setTimeout(() => {
      callback(gapi.auth.getToken());
    }, 1);
  }
};
gapi.offLoggedIn = (callback) => {
  loggedInCallbacks = _.filter(loggedInCallbacks, (cb) => {
    return cb !== callback;
  });
};

gapi.isLoggedIn = () => {
  return !!(gapi.auth && gapi.auth.getToken() && gapi.auth.getToken().access_token);
};

gapi.login = (immediate) => {
  gapi.client.setApiKey(apiKey);
  gapi.auth.authorize({
    client_id: clientId,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/contacts.readonly',
    ],
    immediate: !!immediate
  }, (result) => {
    if (result.error) {
      console.log(result);
    } else {
      _.each(loggedInCallbacks, (cb) => {
        cb(result);
      });
    }
  });
};

let loggedOutCallbacks = [];
let hasLoggedIn = false;
gapi.onLoggedOut = (callback) => {
  loggedOutCallbacks.push(callback);
};
gapi.offLoggedOut = (callback) => {
  loggedOutCallbacks = _.filter(loggedOutCallbacks, (cb) => {
    return cb !== callback;
  });
};

let pollToken = () => {
  if (gapi.isLoggedIn()) {
    hasLoggedIn = true;
  } else if (hasLoggedIn) {
    hasLoggedIn = false;
    _.each(loggedOutCallbacks, (cb) => {
      return cb();
    });
  }

  window.setTimeout(pollToken, 1000);
};
pollToken();


let hasInitPoll = () => {
  if (gapi.client) {
    _.each(callbacks, (cb) => {
      cb();
    });
    callbacks = [];

    gapi.login(true);
  } else if (gapi.load) {
    gapi.load('client');
  } else {
    window.setTimeout(hasInitPoll, 100);
  }
};
hasInitPoll();

export default gapi;
