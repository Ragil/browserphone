import env from 'env';
import gapi from 'src/common/gapi';
import voice from 'src/common/voice';
import React from 'react';
import Twilio from 'src/common/twilio';
import '!style!css!less!./phone_page.less';


export default class PhonePage extends React.Component {

  callNumber(e) {
    let number = e.target.attributes['data-number'].nodeValue;
    voice.call(number);
  }

  render() {
    let number = this.props.number;

    return (
      <div className="phone-page">
        <span className="phone-page-number">
          {number}
        </span>

        <button className="btn btn-success"
            onClick={this.callNumber.bind(this)}
            data-number={number} >
          <span className="glyphicon glyphicon-phone"
              data-number={number}></span>
        </button>

        <a className="btn btn-primary" href={env.appBase + '/sms/' + encodeURIComponent(number)}>
          <span className="glyphicon glyphicon-envelope"></span>
        </a>
      </div>
    );
  }
}

PhonePage.propTypes = {
  number : React.PropTypes.string.isRequired
};
