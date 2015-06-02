import React from 'react';
import messages from './sms_model';
import contacts from 'src/common/contacts/contacts';


export default class ConversationPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingSMS : false,
      loadingContact : false
    };
  }

  componentDidMount() {
    this.setState({ loadingSMS : true, loadingContact : true });
    messages.fetch({
      callback : this.messagesLoaded.bind(this)
    });
    contacts.fetch(this.contactsLoaded.bind(this));
  }

  contactsLoaded() {
    this.setState({ loadingContact : false });
  }

  messagesLoaded() {
    this.setState({ loadingSMS : false });
  }

  render() {
    let contact = contacts.findByNumber(this.props.conversationNumber);
    let conversation = messages.findByConversation(this.props.conversationNumber);

    let name = this.props.conversationNumber;
    if (contact && contact.fullname) {
      name = contact.fullname;
      if (contact.phones.length > 1) {
        name = contact.fullname + ' (' + this.props.conversationNumber + ')';
      }
    }

    let messagesEl = [];

    return (
      <div className="conversation-page">
        <div className="conversation-page-name">
          {name}
        </div>
        <div className="conversation-page-messages">
          {messagesEl}
        </div>
      </div>
    );
  }
}

ConversationPage.propTypes = {
  conversationNumber : React.PropTypes.string.isRequired
};
