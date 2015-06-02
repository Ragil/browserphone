import bootstraputil from 'src/common/bootstraputil';
import contacts from 'src/common/contacts/contacts';
import ConversationSummaryPage from './conversation_summary_page';
import ConversationPage from './conversation_page';
import gapi from 'src/common/gapi';
import env from 'env';
import messages from './sms_model';
import React from 'react';
import ReactSpinner from 'src/common/spin/spin';
import "!style!css!less!./sms_page.less";


export default class SmsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingSms : false,
      loadingContacts : false,
      conversations : []
    };
  }

  componentDidMount() {
    this.setState({
      loadingSms : true,
      loadingContacts : true
    });
    messages.fetch({
      callback : this.onNewMessages.bind(this)
    });
    contacts.fetch(((entries) => {
      this.setState({
        loadingContacts : false
      });
    }).bind(this) );
  }

  onNewMessages(conversations) {
    this.setState({
      loadingSms : false,
      conversations : conversations
    });
  }

  render() {
    if (this.state.loadingSms || this.state.loadingContacts) {
      return (
        <div className="sms-page">
          <div className="sms-page-loader">
            <ReactSpinner />
          </div>
          <div className="sms-page-loading-message">
            {this.state.loadingSms ? "Loading SMS" : "Loading Contacts"}
          </div>
        </div>
      );
    }

    let conversationEls = _.map(this.state.conversations, (convo, index) => {
      return <ConversationSummaryPage conversation={convo} key={index} />;
    });

    let content;
    if (this.props.number) {

      // show summary with messages on the right
      content = [(
        <div className={bootstraputil.col(5)} key="1">
          {conversationEls}
        </div>
      ), (
        <div className={bootstraputil.col(7)} key="2">
          <ConversationPage conversationNumber={this.props.number} />
        </div>
      )];
    } else {

      // only show summary
      content = (
        <div className={bootstraputil.col(12)}>
          {conversationEls}
        </div>
      );
    }

    return (
      <div className="sms-page">
        <div className="sms-page-summary row">
          {content}
        </div>
      </div>
    );
  }
}

SmsPage.propTypes = {
  number : React.PropTypes.string
};
