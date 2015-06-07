var _ = require('lodash');
var React = require('react');
var Spinner = require('spin.js/spin');
require('!style!css!less!./spin.less');

var ReactSpinner = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    stopped: React.PropTypes.bool,
    msg: React.PropTypes.string
  },

  componentDidMount: function() {
    this.spinner = new Spinner(this.props.config);
    this.spinner.spin(this.refs.container.getDOMNode());
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.stopped === true && !this.props.stopped) {
      this.spinner.stop();
    } else if (!newProps.stopped && this.props.stopped === true) {
      this.spinner.spin(this.refs.container.getDOMNode());
    }
  },

  componentWillUnmount: function() {
    this.spinner.stop();
  },

  render: function() {
    let defaultConfig = {
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
    let config = _.extend(defaultConfig, this.props.config);

    return (
      <div className="react-spinner">
        <div ref="container" className="react-spinner-spin" style={{
          height : config.radius * 5,
          width : config.radius * 5,
          position : 'relative'
        }} />
        <div className="react-spinner-message">
          {this.props.msg}
        </div>
      </div>
    );
  }
});

module.exports = ReactSpinner;
