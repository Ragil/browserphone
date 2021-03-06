import React from "react";

import gapi from '../../common/gapi';
import Router from "react-router";
import TwilioDevicePage from './twilio_device_page';
let { RouteHandler } = Router;

export default class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loggedIn : gapi.isLoggedIn()
    };

    this._login = this.login.bind(this);
    this._onLoggedIn = this.onLoggedIn.bind(this);

    gapi.onLoggedIn(this._onLoggedIn);
    gapi.onLoggedOut(this._login);
  }

  onLoggedIn() {
    this.setState({
      loggedIn : gapi.isLoggedIn()
    });
  }

  login() {
    this.setState({
      loggedIn : gapi.isLoggedIn()
    });
    gapi.login();
  }

  componentWillUnmount() {
    gapi.offLoggedOut(this._login);
    gapi.offLoggedIn(this._onLoggedIn);
  }

  render() {
    let loggedInContent = (
      <TwilioDevicePage>
        <RouteHandler {... this.props} />
      </TwilioDevicePage>
    );
    let loggedOutContent = (
      <button className="btn btn-primary"
          onClick={this.login.bind(this)}>Login</button>
    );

    let content = this.state.loggedIn ? loggedInContent : loggedOutContent;
    return (
      <div id="landing-page" className="container">
        {content}
      </div>
    );
  }
}
