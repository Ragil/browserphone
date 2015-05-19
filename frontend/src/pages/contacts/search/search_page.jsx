import React from 'react';


export default class SearchPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div className="search-page row">
        <form>
          <div className="form-group">
            <input type="search" className="form-control" ref="searchInput"
                value={this.props.value}
                onChange={this.onChange.bind(this)}
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
