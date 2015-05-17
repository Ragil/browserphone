import $ from 'jquery';
import DialpadPage from './dialpad/dialpad_page';
import env from 'env';
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
      connection : undefined,
      device : undefined
    };

    this.setupDevice();
    this.initDevice();
  }

  updateDevice(device) {
    this.setState(_.extend(this.state, {
      device : device
    }));
  }

  updateConnection(connection) {
    this.setState(_.extend(this.state, {
      connection : connection
    }));
  }

  onDeviceOrConnectionError(error) {
    this.setState(_.extend(this.state, {
      error : error
    }));
  }

  setupDevice() {
    _.each(['ready', 'offline'], (e) => {
      Twilio.Device[e](this.updateDevice.bind(this));
    }, this);
    _.each(['cancel', 'connect', 'disconnect', 'incoming'], (e) => {
      Twilio.Device.incoming(this.updateConnection.bind(this));
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
    let spinnerConfig = {
      lines: 11, // The number of lines to draw
      length: 8, // The length of each line
      width: 5, // The line thickness
      radius: 13, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1.1, // Rounds per second
      trail: 100, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };
    let spinner = <ReactSpinner config={spinnerConfig}/>;

    if (!this.state.device) {
      content = (
        <div className="voice-page-loading">
          <div className="voice-page-loading-spinner">
            {spinner}
          </div>
          <div className="voice-page-loading-message">
            Initializing Twilio Client
          </div>
        </div>
      );
    } else {
      content = (
        <div className="voice-page-dialpad">
          <DialpadPage {...this.state} />
        </div>
      );
    }

    return (
      <div className="voice-page">
        {content}
      </div>
    );
  }
}
