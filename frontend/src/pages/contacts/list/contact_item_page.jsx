import $ from 'jquery';
import ContactImagePage from '../../contact/img/contact_img_page';
import env from 'env';
import gapi from 'src/common/gapi';
import global from 'src/common/global';
import React from 'react';
import bootstraputil from 'src/common/bootstraputil';
import "!style!css!less!./contact_item_page.less";

let Twilio = window.Twilio;


export default class ContactItemPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {

    let phones = this.props.contact.phones;
    let phonesEl = [];
    if (phones) {
      phonesEl = _.map(phones, (number, index) => {
        return (
          <div className="contact-item-page-phone" key={index}>
            <span className="contact-item-page-phone-number">
              {number}
            </span>
          </div>
        );
      });
    }

    return (
      <div className={"contact-item-page" + bootstraputil.col(12)}>
        <div className="contact-item-page-container row">

          <div className={"contact-item-page-photo" + bootstraputil.col([3, 3, 2, 2])}>
            <ContactImagePage contact={this.props.contact} />
          </div>

          <div className={bootstraputil.col([9,9,10,10])}>
            <div className="row">
              <div className={"contact-item-page-user" + bootstraputil.col([6, 6, 6, 6])}>
                <div className="contact-item-page-name">
                  <a href={env.appBase + '/contact/' + this.props.contact.id}>
                    {this.props.contact.fullname}
                  </a>
                </div>
                <div className="contact-item-page-email">
                  {this.props.contact.primaryEmail}
                </div>
              </div>

              <div className={"contact-item-page-phones" + bootstraputil.col([6, 6, 6, 6])}>
                {phonesEl}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

ContactItemPage.propTypes = {
  contact : React.PropTypes.object.isRequired
};
