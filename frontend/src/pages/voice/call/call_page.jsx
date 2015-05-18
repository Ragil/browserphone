import React from 'react';
import CallerPage from './caller/caller_page';
import '!style!css!less!./call_page.less';
import bootstraputil from 'src/common/bootstraputil';
import ReactSpinner from 'src/common/spin/spin';


export default class CallPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // keep state to force re-render
    this.state = {
      isMuted : this.props.connection.isMuted()
    };
  }

  btn(containerClass, btnClass, text, callback, key) {
    return (
      <div className={containerClass} key={key}>
        <button className={btnClass} onClick={callback}>{text}</button>
      </div>
    );
  }

  accept() {
    this.props.connection.accept();
  }

  reject() {
    this.props.connection.reject();
  }

  ignore() {
    this.props.connection.ignore();
  }

  hangup() {
    this.props.connection.disconnect();
  }

  toggleMute() {
    this.props.connection.mute(!this.props.connection.isMuted());
    this.setState({
      muted : this.props.connection.isMuted()
    });
  }

  render() {
    let actions;
    let containerClass = 'call-page-action-container ';

    if (this.props.connection.status() === 'pending') {

      let rightActions = (
        <div className={containerClass} key='2'>
          {this.btn(containerClass + bootstraputil.col(1) + bootstraputil.coloffset(2),
              'btn btn-warning', 'Ignore', this.ignore.bind(this))}
          {this.btn(containerClass + bootstraputil.col(1),
              'btn btn-danger', 'Reject', this.reject.bind(this))}
        </div>
      );

      let leftActions = (
        this.btn(containerClass + bootstraputil.col(4),
            'btn btn-success', 'Answer', this.accept.bind(this), "1")
      );

      actions = [leftActions, rightActions];

    } else if (this.props.connection.status() === 'connecting') {

      actions = [(
        <div className={bootstraputil.col(8)} key="1">
          <ReactSpinner />
        </div>
      )];

    } else if (this.props.connection.status() === 'open') {

      let rightActions = (
        <div className={containerClass} key="2">
          {this.btn(containerClass + bootstraputil.col(1) + bootstraputil.coloffset(1),
              "btn btn-danger", 'Hangup', this.hangup.bind(this))}
        </div>
      );

      let soundIcon = this.props.connection.isMuted() ?
          'glyphicon-volume-off' : 'glyphicon-volume-up';
      let sound = (
        <button className="btn" onClick={this.toggleMute.bind(this)}>
          <span className={"glyphicon " + soundIcon}></span>
        </button>
      );

      let leftActions = (
        <div className={'call-page-sound' + bootstraputil.col(8)} key="1">
          {sound}
        </div>
      );

      actions = [leftActions, rightActions];
    }

    return (
      <div className="call-page">
        <div className="call-page-people row">
          <CallerPage numberOrClient={this.props.me} />

          <div className={'call-page-arrow' + bootstraputil.col(2)}>
            <span className="glyphicon glyphicon-arrow-right"></span>
          </div>

          <CallerPage numberOrClient={this.props.other} />
        </div>
        <div className="call-page-actions row">
          <span className={bootstraputil.col(2)}></span>
          {actions}
        </div>
      </div>
    );
  }
}

CallPage.prototype.propTypes = {
  connection : React.PropTypes.object.isRequired,
  me : React.PropTypes.string.isRequired,
  other : React.PropTypes.string.isRequired
};
