import _ from 'lodash';

class Util {
  hideSmall() {
    return ' hidden-sm hidden-xs ';
  }
  coloffset(size) {
    return this.col('offset-' + size);
  }
  col(size) {
    if (!size.length) {
      size = [size];
    }
    if (size.length !== 1 && size.length !== 4) {
      throw "must provide a size or an array containing 4 sizes from small to large";
    }
    return _.map([' col-xs', ' col-sm', ' col-md', ' col-lg'],
        (column, index) => {
      let s = size[index % size.length];
      if (s === 0) {
        return ' hidden-' + column.trim().replace('col-', '');
      }
      return column + '-' + s;
    }).join(' ');
  }
}

export default new Util()
