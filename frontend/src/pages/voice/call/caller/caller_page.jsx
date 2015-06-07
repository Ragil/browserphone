import bootstraputil from 'src/common/bootstraputil';
import contacts from 'src/common/contacts/contacts';
import ContactImagePage from 'src/pages/contact/img/contact_img_page';
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
          <div className="caller-page-id client">
            {client}
          </div>
        </div>
      );

    } else {

      let number = this.props.numberOrClient;
      let contact = contacts.findByNumber(number);
      let name = contact ? contact.getIdentity(number) : number;

      content = (
        <div className="caller-page-number jumbotron">
          <ContactImagePage contact={contact} width="100px" />
          <div className="caller-page-id contact">
            {name}
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

CallerPage.propTypes = {
  numberOrClient : React.PropTypes.string.isRequired
};
