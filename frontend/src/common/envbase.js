import _ from 'lodash'


export default class Env {
  constructor(opts) {
    _.extend(this, opts);

    this.phoneNumber = '+14159152352';
    this.service = {
      capability : opts.baseURL + '/api/twilio/capability',
      contacts : opts.baseURL + '/api/google/contacts',
      sms : opts.baseURL + '/api/twilio/sms',
      user : opts.baseURL + '/api/user'
    }
  }
};
