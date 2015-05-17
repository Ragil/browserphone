import _ from 'lodash'


export default class Env {
  constructor(opts) {
    _.extend(this, opts);

    this.service = {
      capability : opts.baseURL + '/api/twilio/capability'
    }
  }
};
