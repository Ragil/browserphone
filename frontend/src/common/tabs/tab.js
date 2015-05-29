import _ from 'lodash';


export default class Tab {
  constructor(opts) {
    if (!opts.title) {
      throw new Error('title is required');
    }
    if (!opts.component) {
      throw new Error('component is required');
    }
    _.extend(this, opts);
  }
}
