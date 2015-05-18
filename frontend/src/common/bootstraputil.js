import _ from 'lodash';

class Util {
  coloffset(size) {
    return this.col('offset-' + size);
  }
  col(size) {
    return _.map([' col-xs', ' col-sm', ' col-md', ' col-lg'],
        (column) => {
      return column + '-' + size;
    }).join(' ');
  }
}

export default new Util()
