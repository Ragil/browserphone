import bootstraputil from 'src/common/bootstraputil';
import contacts from 'src/common/contacts/contacts';
import ContactImagePage from '../contact/img/contact_img_page';
import moment from 'moment';
import React from 'react';
import '!style!css!less!./conversation_summary_page.less';


export default class ConversationSummaryPage extends React.Component {
  render() {
    let contact = contacts.findByNumber(this.props.conversation.otherNumber);
    let name = this.props.conversation.otherNumber;
    if (contact && contact.fullname) {
      name = contact.fullname;

      if (contact.phones.length > 1) {
        name = contact.fullname + ' (' + this.props.conversation.otherNumber  + ')';
      }
    }

    return (
      <div className="conversation-summary-page row">

        <div className={"conversation-summary-page-img" + bootstraputil.col(2)}>
          <ContactImagePage contact={contact} />
        </div>

        <div className={"conversation-summary-page-content" + bootstraputil.col(10)}>

          <div className="conversation-summary-page-top row">
            <a href={"/phone/sms/" + encodeURIComponent(this.props.conversation.otherNumber)} >
              <span className={"conversation-summary-page-name" + bootstraputil.col(7)}>
                {name}
              </span>
            </a>
            <span className={"conversation-summary-page-time" + bootstraputil.col(5)}>
              {moment(this.props.conversation.latestMessage.date_created).
                  calendar()}
            </span>
          </div>

          <div className="conversation-summary-page-bottom">
            <span className="conversation-summary-page-message">
              {this.props.conversation.latestMessage.body}
            </span>
          </div>
        </div>

      </div>
    );
  }
}

ConversationSummaryPage.propTypes = {
  conversation : React.PropTypes.object.isRequired
};
