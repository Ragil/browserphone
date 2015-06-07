import _ from 'lodash';
import bootstraputil from 'src/common/bootstraputil';
import contacts from 'src/common/contacts/contacts';
import ContactImagePage from '../contact/img/contact_img_page';
import React from 'react';
import moment from 'moment';
import '!style!css!less!./message_body_page.less';


export default class MessageBodyPage extends React.Component {
  render() {
    let contact = contacts.findByNumber(this.props.message.from);

    let messageBody = (
      <div className={this.props.message.isSelf ? "self" : "other"}>
        <p className={"message-page-text " + this.props.message.status} >
          {this.props.message.body}
        </p>
        <span className="message-page-time">
          {moment(this.props.message.date_created).fromNow()}
        </span>
      </div>
    );

    let msgWidth = this.props.message.isSelf ?
        bootstraputil.col(12) : bootstraputil.col([10,11,11,11]);

    let content = [(
      <div className={"message-page-image" + bootstraputil.col([2,1,1,1])} key="2">
        <ContactImagePage contact={contact} width='40px' />
      </div>
    ), (
      <div  className={"message-page-text-container" + msgWidth} key="1">
        {messageBody}
      </div>
    )];

    content = this.props.message.isSelf ? _.last(content) : content;

    return (
      <div className="message-page">
        <div className="message-page-content row">
          {content}
        </div>
      </div>
    );
  }
}

MessageBodyPage.propTypes = {
  message : React.PropTypes.object.isRequired
};
