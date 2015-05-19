import $ from 'jquery';
import gapi from 'src/common/gapi';
import global from 'src/common/global';
import React from 'react';
import bootstraputil from 'src/common/bootstraputil';
import "!style!css!less!./contact_page.less";

let Twilio = window.Twilio;


export default class ContactPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  callNumber(e) {
    let number = e.target.attributes['data-number'].nodeValue;

    global.call.From = '61401910355';
    global.call.To = number;
    Twilio.Device.connect({
      From: global.call.From,
      To: number,
      Direction: 'outbound',
      'google-token': gapi.auth.getToken().access_token
    });
  }

  render() {

    let phones = this.props.contact.phones;
    let phonesEl = [];
    if (phones) {
      phonesEl = _.map(phones, (number, index) => {
        return (
          <div className="contact-page-phone" key={index}>
            <span className="contact-page-phone-number">
              {number}
            </span>
            <button className="btn btn-success"
                onClick={this.callNumber.bind(this)}
                data-number={number} >
              <span className="glyphicon glyphicon-phone"
                  data-number={number}></span>
            </button>
          </div>
        );
      });
    }

    let photoEl;
    if (this.props.contact.photoLink) {
      let photoLink = this.props.contact.photoLink + '?' + $.param({
        access_token : gapi.auth.getToken().access_token
      });

      photoEl = (
        <div className="contact-page-icon-container">
          <img src={photoLink} />
        </div>
      );
    } else  {
      photoEl = (
        <div className="contact-page-icon-container contact-page-no-image">
          <span className="glyphicon glyphicon-user"></span>
        </div>
      );
    }

    return (
      <div className={"contact-page" + bootstraputil.col(12)}>

        <div className={"contact-page-photo" + bootstraputil.col(2)}>
          {photoEl}
        </div>

        <div className={"contact-page-user" + bootstraputil.col(6)}>
          <div className="contact-page-name">
            {this.props.contact.fullname}
          </div>
          <div className="contact-page-email">
            {this.props.contact.primaryEmail}
          </div>
        </div>

        <div className={"contact-page-phones" + bootstraputil.col(4)}>
          {phonesEl}
        </div>

      </div>
    );
  }
}

ContactPage.propTypes = {
  contact : React.PropTypes.object.isRequired
};
