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


class SmsPageLoader extends React.Component {
  render() {
    return (
      <div className="sms-page-loader">
        <ReactSpinner />
        <div className="sms-page-loading-message">
          {this.props.loadingSms ? "Loading SMS" : "Loading Contacts"}
        </div>
      </div>
    );
  }
}
SmsPageLoader.propTypes = {
  loadingSms : React.PropTypes.bool.isRequired
};


class SmsPageSummary extends React.Component {
  render() {
    let content;
    let conversationEls = _.map(this.props.conversations, (convo, index) => {
      return <ConversationSummaryPage conversation={convo} key={index} />;
    });

    if (this.props.number) {

      // show summary with messages on the right
      content = [(
        <div className={bootstraputil.col([0, 0, 5, 5])} key="1">
          {conversationEls}
        </div>
      ), (
        <div className={bootstraputil.col([12, 12, 7, 7])} key="2">
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
      <div className="sms-page-summary">
        {content}
      </div>
    );
  }
}
SmsPageSummary.propTypes = {
  number : React.PropTypes.string,
  conversations : React.PropTypes.array.isRequired
};


class SmsPageContactSelection extends React.Component {
  render() {
    <div className="sms-page-contact-selection">
    </div>
  }
}


export default class SmsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectContact : false,
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

  createNewMessage(number) {

  }

  render() {
    let content;
    if (this.state.loadingSms || this.state.loadingContacts) {
      content = <SmsPageLoader loadingSms={this.state.loadingSms} />;
    } else if (this.state.selectContact) {
      content = <SmsPageContactSelection />;
    } else {
      content = <SmsPageSummary number={this.props.number}
          conversations={this.state.conversations} />;
    }

    return (
      <div className="sms-page">
        {content}
      </div>
    );
  }
}

SmsPage.propTypes = {
  number : React.PropTypes.string
};
