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
import '!style!css!less!./voice_page.less';

let Twilio = window.Twilio;


export default class VoicePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      device : this.getDeviceState() !== 'offline' ? Twilio.Device : undefined,
      connection : this.getDeviceState() !== 'offline' ?
          Twilio.Device.activeConnection() : undefined,

      // toggle to refresh since connection/device are the same reference
      refreshFlag : true
    };

    this.setupDevice();
    this.initDevice();
  }

  updateDevice(device) {
    this.setState({
      device : device,
      refreshFlag : !this.state.refreshFlag
    });
  }

  updateConnection(connection) {
    this.setState({
      connection : connection,
      refreshFlag : !this.state.refreshFlag
    });
  }

  onDeviceOrConnectionError(error) {
    this.setState({
      error : error,
      refreshFlag : !this.state.refreshFlag
    });

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

  getDeviceState() {
    try {
      return Twilio.Device.status();
    } catch (e) {
      return 'offline'
    }
  }

  initDevice() {
    if (this.getDeviceState() === 'offline') {

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
        content = [(
          <div className={"voice-page-contacts" + bootstraputil.col(6)} key="1">
            <ContactsPage {...this.state} />
          </div>
        ), (
          <div className={"voice-page-tabs" + bootstraputil.col(6)} key="2">
            <DialpadPage allowCalling={true} />
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
