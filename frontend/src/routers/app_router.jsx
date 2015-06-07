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
    let props = _.extend(this.props, this.props.query);
    return ( <MainTabPage {... props} /> );
  }
}
VoiceRouter.defaultProps = { showVoice : true };

class SmsRouter extends VoiceRouter { }
SmsRouter.defaultProps = { showSMS : true };


ContainerRouter.getRoutes = function() {
  return (
    <Route name="container" path="/" handler={ContainerRouter} >
      <Route name="main" path="phone/" handler={MainPage} >
        <Route name="voice" path="voice" handler={VoiceRouter}></Route>
        <Route name="sms" path="sms" handler={SmsRouter}></Route>
        <Route name="test" path="test" handler={TestRouter}></Route>

        <DefaultRoute handler={VoiceRouter} />
      </Route>
    </Route>
  );
}
