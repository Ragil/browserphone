import _ from 'lodash';
import bootstraputil from 'src/common/bootstraputil';
import ContactImagePage from './img/contact_img_page';
import PhonePage from './phone_page';
import React from 'react';
import '!style!css!less!./contact_page.less';


export default class ContactPage extends React.Component {
  render() {
    if (!this.props.contact) {
      return (
        <div className="contact-page">
          Not Found
        </div>
      );
    }

    let phoneEls = _.map(this.props.contact.phones, (number, index) => {
      return <PhonePage number={number} key={index} />
    });

    return (
      <div className="contact-page">
        <div className="row">
          <div className={"contact-page-img" + bootstraputil.col([3, 2, 1, 1])}>
            <ContactImagePage contact={this.props.contact} />
          </div>
          <div className={"contact-page-info" + bootstraputil.col([9,9,10,10])}>
            <div className="row">

              <div className={"contact-page-identity" + bootstraputil.col([12, 6, 6, 6])}>
                <div className="contact-page-name">
                  {this.props.contact.fullname}
                </div>
                <div className="contact-page-email">
                  {this.props.contact.primaryEmail}
                </div>
              </div>

              <div className={"contact-page-phone" + bootstraputil.col([12, 6, 6, 6])}>
                {phoneEls}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
ContactPage.propTypes = {
  contact : React.PropTypes.object.isRequired
};
