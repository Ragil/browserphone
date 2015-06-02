import React from "react";

import VoicePage from '../voice/voice_page';
import gapi from '../../common/gapi';
import Router from "react-router";
let { RouteHandler } = Router;

export default class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loggedIn : gapi.isLoggedIn()
    };

    gapi.onLoggedIn((() => {
      this.setState({
        loggedIn : gapi.isLoggedIn()
      });
    }).bind(this));
  }

  login() {
    gapi.login();
  }

  render() {
    let loggedInContent = (
      <RouteHandler {... this.props} />
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
