import bootstraputil from 'src/common/bootstraputil';
import ContactsPage from '../contacts/contacts_page';
import DialpadPage from './dialpad/dialpad_page';
import React from 'react';
import '!style!css!less!./voice_page.less';

let Twilio = window.Twilio;


export default class VoicePage extends React.Component {
  render() {
    return (
      <div className="voice-page row">
        <div className={"voice-page-tabs" + bootstraputil.col([12, 6, 4, 4])} key="2">
          <DialpadPage allowCalling={true} />
        </div>
        <div className={"voice-page-contacts" + bootstraputil.col([12, 6, 8, 8])} key="1">
          <ContactsPage {...this.props} />
        </div>
      </div>
    );
  }
}
