import env from 'env';
import contacts from 'src/common/contacts/contacts';
import ContactPage from '../contact/contact_page';
import DialpadPage from '../voice/dialpad/dialpad_page';
import React from 'react';
import ReactSpinner from 'src/common/spin/spin';
import SmsPage from '../sms/sms_page';
import VoicePage from '../voice/voice_page';
import ConfigPage from '../config/config_page';
import Tab from 'src/common/tabs/tab';
import TabPage from 'src/common/tabs/tab_page';


export default class MainTabPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingContacts : this.props.showContact
    };
  }

  componentDidMount() {
    if (this.props.showContact) {
      this.loadContacts();
    }
  }

  loadContacts() {
    contacts.fetch((() => {
      this.setState({ loadingContacts : false });
    }).bind(this));
  }

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
      }),
      new Tab({
        title : 'Config', href: env.appBase + '/config',
        selected : this.props.showConfig,
        component : <ConfigPage {... this.props}/>
      })
    ];

    if (this.props.contactId) {
      let contact = contacts.findById(this.props.contactId);
      tabs.push(new Tab({
        title : this.state.loadingContacts ? 'Loading ...' : contact.fullname,
        selected : this.props.showContact,
        component : this.state.loadingContacts ?
            <ReactSpinner msg="Loading Contacts..."/> : <ContactPage contact={contact} />
      }));
    }

    return (
      <TabPage tabs={tabs} />
    );
  }
}

MainTabPage.propTypes = {
  showConfig : React.PropTypes.bool,
  showSMS : React.PropTypes.bool,
  showVoice : React.PropTypes.bool,
  showContact : React.PropTypes.bool,
  contactId : React.PropTypes.string.isRequired
};
