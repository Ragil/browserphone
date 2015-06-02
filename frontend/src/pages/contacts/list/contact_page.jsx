import $ from 'jquery';
import ContactImagePage from '../img/contact_img_page';
import env from 'env';
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

    global.call.From = env.phoneNumber;
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

    return (
      <div className={"contact-page" + bootstraputil.col(12)}>
        <div className="row">

          <div className={"contact-page-photo" + bootstraputil.col(2)}>
            <ContactImagePage contact={this.props.contact} />
          </div>

          <div className={"contact-page-user" + bootstraputil.col(5)}>
            <div className="contact-page-name">
              {this.props.contact.fullname}
            </div>
            <div className="contact-page-email">
              {this.props.contact.primaryEmail}
            </div>
          </div>

          <div className={"contact-page-phones" + bootstraputil.col(5)}>
            {phonesEl}
          </div>

        </div>
      </div>
    );
  }
}

ContactPage.propTypes = {
  contact : React.PropTypes.object.isRequired
};
