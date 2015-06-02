/**
 * App entry point
 */

// Polyfill
import "babel-core/polyfill";

// Libraries
import $ from 'jquery';
import env from 'env';
import React from "react";
import Router from "react-router";

// Routers
import AppRouter from "./routers/app_router";


// ID of the DOM element to mount app on
const DOM_APP_EL_ID = "app";


// Initialize routes depending on session
let routes = AppRouter.getRoutes();
let currentHandler = undefined;

// Start the router
Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  currentHandler = <Handler />;
  React.render(currentHandler, document.getElementById(DOM_APP_EL_ID));
});

// prevent all a clicks from going anywhere
$('body').click((e) => {
  let parent = e.target;
  while (parent) {
    if (parent && parent.href && parent.href.indexOf(env.appBase) >= 0) {
      e.preventDefault();
      let route = '/phone' + parent.href.substring(env.appBase.length);
      currentHandler.type.transitionTo.call(currentHandler, route);
      return;
    }
    parent = parent.parentNode;
  }
});
