import $ from 'jquery';
import bootstraputil from 'src/common/bootstraputil';
import CallPage from './call/call_page';
import ContactsPage from '../contacts/contacts_page';
import DialpadPage from './dialpad/dialpad_page';
import env from 'env';
import global from 'src/common/global';
import 'jquery.cookie';
import gapi from '../../common/gapi';
import React from 'react';
import ReactSpinner from 'src/common/spin/spin';
import Tab from 'src/common/tabs/tab';
import TabPage from 'src/common/tabs/tab_page';
import '!style!css!less!./voice_page.less';

let Twilio = window.Twilio;


export default class VoicePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      connection : undefined,
      device : undefined,

      // toggle to refresh since connection/device are the same reference
      refreshFlag : true
    };

    this.setupDevice();
    this.initDevice();
  }

  updateDevice(device) {
    this.setState(_.extend(this.state, {
      device : device,
      refreshFlag : !this.state.refreshFlag
    }));
  }

  updateConnection(connection) {
    this.setState(_.extend(this.state, {
      connection : connection,
      refreshFlag : !this.state.refreshFlag
    }));
  }

  onDeviceOrConnectionError(error) {
    this.setState(_.extend(this.state, {
      error : error,
      refreshFlag : !this.state.refreshFlag
    }));

    this.initDevice();
  }

  setupDevice() {
    _.each(['ready', 'offline'], (e) => {
      Twilio.Device[e](this.updateDevice.bind(this));
    }, this);
    _.each(['cancel', 'connect', 'disconnect', 'incoming'], (e) => {
      Twilio.Device[e](this.updateConnection.bind(this));
    }, this);
    Twilio.Device.error(this.onDeviceOrConnectionError.bind(this));
  }

  initDevice() {
    let user = 'google-token';
    let password = gapi.auth.getToken().access_token;

    $.ajax({
      url : env.service.capability,
      data : {
        'client_name' : 'browser'
      },
      username : user,
      password : password,
      beforeSend: function(req) {
        req.setRequestHeader('Authorization',
            'Basic ' + btoa(user + ':' + password));
      }
    }).done((data, status, jqXHR) => {
      Twilio.Device.setup(data.token, {
        debug : true,
        closeProtection : true
      });
    })
  }

  render() {
    let content;
    let spinner = <ReactSpinner />;

    if (!this.state.device || this.state.device.status() === 'offline') {
      let message = this.state.error ?
          this.state.error.message + ' - Reinitializing Twilio Client' :
          'Initializing Twilio Client';

      content = (
        <div className="voice-page-loading">
          <div className="voice-page-loading-spinner">
            {spinner}
          </div>
          <div className="voice-page-loading-message">
            {message}
          </div>
        </div>
      );
    } else {

      if (this.state.connection && ['pending', 'connecting', 'open']
          .indexOf(this.state.connection.status()) !== -1) {

        let from = this.state.connection.parameters.From;
        from = from ? from : global.call.From;
        let to = this.state.connection.parameters.To;
        to = to ? to : global.call.To;

        content = (
          <div className="voice-page-active-call">
            <CallPage from={from} to={to}
                connection={this.state.connection} />
          </div>
        );
      } else {
        let tabs = [new Tab({
          title : 'Dial Pad',
          component : <DialpadPage allowCalling={true} />
        })];

        content = [(
          <div className={"voice-page-contacts" + bootstraputil.col(6)}>
            <ContactsPage {...this.state} />
          </div>
        ), (
          <div className={"voice-page-tabs" + bootstraputil.col(6)}>
            <TabPage tabs={tabs} />
          </div>
        )];
      }
    }

    return (
      <div className="voice-page row">
        {content}
      </div>
    );
  }
}
