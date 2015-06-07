import _ from 'lodash';
import React from "react";
import Router from "react-router";
let { Route, DefaultRoute, RouteHandler, Navigation } = Router;

import MainPage from "../pages/main/main_page";
import MainTabPage from '../pages/main/main_tab_page';

export default class RouterWithNavigation extends React.Component {
  mixins: [Navigation]
}

export default class ContainerRouter extends RouterWithNavigation {
  render() {
    return (
      <div id="container">
        <div id="main">
          <RouteHandler {... this.props} />
        </div>
      </div>
    );
  }
}

class VoiceRouter extends RouterWithNavigation {
  render() {
    let decodedParams = {};
    _.each(this.props.params, (value, key) => {
      decodedParams[key] = decodeURIComponent(value);
    });
    let props = _.extend({}, this.props, this.props.query, decodedParams);
    return ( <MainTabPage {... props} /> );
  }
}
VoiceRouter.defaultProps = { showVoice : true };

class SmsRouter extends VoiceRouter { }
SmsRouter.defaultProps = { showSMS : true };

class ContactRouter extends VoiceRouter { }
ContactRouter.defaultProps = { showContact : true };


ContainerRouter.getRoutes = function() {
  return (
    <Route name="container" path="/" handler={ContainerRouter} >
      <Route name="main" path="phone/" handler={MainPage} >
        <Route name="voice" path="voice" handler={VoiceRouter}></Route>
        <Route name="sms" path="sms" handler={SmsRouter}></Route>
        <Route name="conversation" path="sms/:number" handler={SmsRouter}></Route>
        <Route name="contact" path="contact/:contactId" handler={ContactRouter}></Route>

        <DefaultRoute handler={VoiceRouter} />
      </Route>
    </Route>
  );
}
