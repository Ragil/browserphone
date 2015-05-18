import bootstraputil from 'src/common/bootstraputil';
import React from 'react';
import "!style!css!less!./caller_page.less";


export default class CallerPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let content;

    if (this.props.numberOrClient.indexOf('client:') !== -1) {

      let client = this.props.numberOrClient.substring('client:'.length);
      content = (
        <div className="caller-page-client jumbotron">
          <div className="caller-page-icon">
            <span className="glyphicon glyphicon-phone"></span>
          </div>
          <div className="caller-page-id">
            {client}
          </div>
        </div>
      );

    } else {

      let number = this.props.numberOrClient;
      content = (
        <div className="caller-page-number jumbotron">
          <div className="caller-page-icon">
            <span className="glyphicon glyphicon-user"></span>
          </div>
          <div className="caller-page-id">
            {number}
          </div>
        </div>
      );

    }

    return (
      <div className={"caller-page" + bootstraputil.col(5)}>
        {content}
      </div>
    );
  }
}

CallerPage.prototype.propTypes = {
  numberOrClient : React.PropTypes.string.isRequired
};
