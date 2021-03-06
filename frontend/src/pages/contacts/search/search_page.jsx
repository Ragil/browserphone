import React from 'react';
import '!style!css!less!./search_page.less';


export default class SearchPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  onKeyPressed(e) {
    if (e.key === 'Enter') {
      // enter key, ignore
      e.preventDefault();
      return;
    }
  }

  render() {
    return (
      <div className="search-page">
        <form>
          <div className="input-group">
            <input type="search" className="form-control" ref="searchInput"
                value={this.props.value}
                onChange={this.onChange.bind(this)}
                onKeyDown={this.onKeyPressed.bind(this)}
                placeholder="Search name or number" />
            <span className="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
          </div>
        </form>
      </div>
    );
  }
}

SearchPage.propTypes = {
  value : React.PropTypes.string.isRequired,
  onChange : React.PropTypes.func.isRequired
};
