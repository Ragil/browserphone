import $ from 'jquery';
import CallPage from '../voice/call/call_page';
import env from 'env';
import global from 'src/common/global';
import gapi from '../../common/gapi';
import React from 'react';
import ReactSpinner from 'src/common/spin/spin';
import '!style!css!less!./twilio_device_page.less';


export default class TwilioDevicePage extends React.Component {
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
    this.setState({ error : error });
    this.initDevice();
  }

  getDeviceState() {
    try {
      return Twilio.Device.status();
    } catch (e) {
      return 'offline'
    }
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

    if (!this.state.device || this.state.device.status() === 'offline') {
      let message = this.state.error ?
          this.state.error.message + ' - Reinitializing Twilio Client' :
          'Initializing Twilio Client';

      content = (
        <div className="twilio-device-page-loading">
          <div className="twilio-device-page-loading-spinner">
            <ReactSpinner />
          </div>
          <div className="twilio-device-page-loading-message">
            {message}
          </div>
        </div>
      );
    } else if (this.state.connection && ['pending', 'connecting', 'open']
          .indexOf(this.state.connection.status()) !== -1) {

      let from = this.state.connection.parameters.From;
      from = from ? from : global.call.From;
      let to = this.state.connection.parameters.To;
      to = to ? to : global.call.To;

      content = (
        <div className="twilio-device-page-active-call">
          <CallPage from={from} to={to}
              connection={this.state.connection} />
        </div>
      );
    } else {
      content = <fieldset>{this.props.children}</fieldset>;
    }

    return (
      <div className="twilio-device-page row">
        {content}
      </div>
    );
  }
}
