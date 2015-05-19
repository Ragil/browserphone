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


let authResult;
let loggedInCallbacks = [];

gapi.onLoggedIn = (callback) => {
  if (!authResult) {
    loggedInCallbacks.push(callback);
  } else {
    window.setTimeout(() => {
      callback(authResult);
    }, 1);
  }
};

gapi.isLoggedIn = () => {
  return !!authResult;
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
      authResult = result;

      console.log(gapi.auth.getToken());
      _.each(loggedInCallbacks, (cb) => {
        cb(result);
      });
      loggedInCallbacks = [];

    }
  });
};


let poll = () => {
  if (gapi.auth) {
    _.each(callbacks, (cb) => {
      cb();
    });
    callbacks = [];

    gapi.login(true);
  } else {
    window.setTimeout(poll, 100);
  }
};
poll();

export default gapi;
