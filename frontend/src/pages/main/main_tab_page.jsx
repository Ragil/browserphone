import env from 'env';
import DialpadPage from '../voice/dialpad/dialpad_page';
import React from 'react';
import SmsPage from '../sms/sms_page';
import VoicePage from '../voice/voice_page';
import Tab from 'src/common/tabs/tab';
import TabPage from 'src/common/tabs/tab_page';


export default class MainTabPage extends React.Component {
  render() {
    let tabs = [
      new Tab({
        title : 'Voice', href: env.appBase + '/voice',
        selected : this.props.showVoice,
        component : <VoicePage {... this.props}/>
      }),
      new Tab({
        title : 'SMS', href: env.appBase + '/sms',
        selected : this.props.showSMS,
        component : <SmsPage {... this.props}/>
      })
    ];

    return (
      <TabPage tabs={tabs} />
    );
  }
}

MainTabPage.propTypes = {
  showSMS : React.PropTypes.bool,
  showVoice : React.PropTypes.bool
};
