import $ from 'jquery';
import gapi from 'src/common/gapi';
import React from 'react';
import bootstraputil from 'src/common/bootstraputil';
import "!style!css!less!./contact_page.less";


export default class ContactPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let phones = this.props.contact.phones;
    let phonesEl = [];
    if (phones) {
      phonesEl = _.map(phones, (number, index) => {
        return (
          <div className="contact-page-phone" key={index}>
            {number}
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
        <img src={photoLink} />
      );
    } else  {
      photoEl = (
        <span className="glyphicon glyphicon-user"></span>
      );
    }

    return (
      <div className={"contact-page" + bootstraputil.col(12)}>

        <div className={"contact-page-photo" + bootstraputil.col(2)}>
          <div className="contact-page-icon-container">
            {photoEl}
          </div>
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
