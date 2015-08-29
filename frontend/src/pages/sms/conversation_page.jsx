import $ from 'jquery';
import env from 'env';
import React from 'react';
import ReactSpinner from 'src/common/spin/spin';
import messages from './sms_model';
import contacts from 'src/common/contacts/contacts';
import MessageBodyPage from './message_body_page';
import '!style!css!less!./conversation_page.less';


export default class ConversationPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingSMS : false,
      loadingContact : false,
      sendingMessage : false,
      showingNMessages : 100,
      messageWindowHeight : '100%'
    };

    this.hasNotScrolled = true;
    this._updateMessageWindow = this.updateMessageWindow.bind(this);
  }

  componentDidMount() {
    this.setState({ loadingSMS : true, loadingContact : true });
    messages.fetch({
      callback : this.messagesLoaded.bind(this)
    });
    messages.onChange(this.onNewMessage.bind(this));
    contacts.fetch(this.contactsLoaded.bind(this));

    this.updateMessageWindow();
    $(window).on('resize', this._updateMessageWindow);
  }

  componentWillUnmount() {
    $(window).off('resize', this._updateMessageWindow);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.conversationNumber !== this.props.conversationNumber) {
      this.hasNotScrolled = true;
    }
  }

  onNewMessage() {
    this.hasNotScrolled = true;
    this.setState({ sendingMessage : false });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.hasNotScrolled) {
      this.hasNotScrolled = false;
      // scroll to some huge number (the bottom)
      this.refs.messages.getDOMNode().scrollTop = 10000000;
    }
  }

  updateMessageWindow() {
    this.setState({ messageWindowHeight : this.computeMessageHeight() });
  }

  computeMessageHeight() {
    let wh = $(window).height();
    let pos = $(this.refs.messages.getDOMNode()).offset();
    let ih = $(this.refs.inputContainer.getDOMNode()).height();
    // 20 px for padding
    return wh - pos.top - ih - 20;
  }

  contactsLoaded() {
    this.setState({ loadingContact : false });
  }

  messagesLoaded() {
    this.setState({ loadingSMS : false });
  }

  sendMessage(e) {
    e.preventDefault();
    this.setState({ sendingMessage : true });

    let messageBody = $(this.refs.textInput.getDOMNode()).val();
    messages.sendMessage({
      from : env.phoneNumber,
      to : this.props.conversationNumber,
      body : messageBody
    });
  }

  render() {
    let contact = contacts.findByNumber(this.props.conversationNumber);
    let conversation = messages.findByConversation(this.props.conversationNumber);

    let name = contact ? contact.getIdentity(this.props.conversationNumber) :
        this.props.conversationNumber;

    let messagesEl = !conversation ? [] : _.chain(conversation.messages)
        .takeRight(this.state.showingNMessages)
        .map((message, index) => {
          return (
            <MessageBodyPage message={message} key={index} />
          );
        }).value();

    let messageStyle = {
      'maxHeight': this.state.messageWindowHeight
    };

    let newMessageForm = (
      <form>
        <div className="input-group">
          <textarea className="form-control" ref="textInput"
              placeholder="Enter new message..." row="2" />
          <span className="input-group-btn">
            <button className="btn btn-success"
                onClick={this.sendMessage.bind(this)}>
              Send
            </button>
          </span>
        </div>
      </form>
    );

    return (
      <div className="conversation-page">
        <div className="conversation-page-name">
          <strong>{name}</strong>
        </div>
        <div className="conversation-page-messages" ref="messages"
            style={messageStyle} >
          {messagesEl}
        </div>
        <div className="conversation-page-input" ref="inputContainer">
          {(this.state.sendingMessage ? <ReactSpinner /> : newMessageForm)}
        </div>
      </div>
    );
  }
}

ConversationPage.propTypes = {
  conversationNumber : React.PropTypes.string.isRequired
};
