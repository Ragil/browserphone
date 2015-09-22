import React from 'react';
import CallerPage from './caller/caller_page';
import '!style!css!less!./call_page.less';
import bootstraputil from 'src/common/bootstraputil';
import ReactSpinner from 'src/common/spin/spin';
import DialpadPage from '../dialpad/dialpad_page';


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

  dialpadChanged(newValue, newKey) {
    this.props.connection.sendDigits(newKey);
  }

  render() {
    let actions;
    let containerClass = 'call-page-action-container ';

    if (this.props.connection.status() === 'pending') {

      let rightActions = (
        <div className={containerClass} key='2'>
          {this.btn(containerClass + bootstraputil.col(2) + bootstraputil.coloffset(2),
              'btn btn-warning', 'Ignore', this.ignore.bind(this))}
          {this.btn(containerClass + bootstraputil.col(2),
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
          {this.btn(containerClass + bootstraputil.col(2) + bootstraputil.coloffset(2),
              "btn btn-danger", 'Hangup', this.hangup.bind(this))}
        </div>
      );

      let soundIcon = this.props.connection.isMuted() ?
          'glyphicon-volume-off' : 'glyphicon-volume-up';

      let leftActions = (
        <div className={'call-page-sound' + bootstraputil.col(8)} key="1">
          <button className="btn" onClick={this.toggleMute.bind(this)}>
            <span className={"glyphicon " + soundIcon}></span>
          </button>
        </div>
      );

      actions = [leftActions, rightActions];
    }

    let other = this.props.to || this.props.from;

    return (
      <div className="call-page">
        <div className="row">
          <div className={"call-page-people" + bootstraputil.col(4) + bootstraputil.coloffset(4)}>
            <CallerPage numberOrClient={other} />
          </div>
        </div>
        <div className="call-page-actions row">
          <div className={bootstraputil.coloffset(4) + bootstraputil.col(4)}>
            <div className="row">
              {actions}
            </div>
          </div>
        </div>
        <div className="call-page-dialpad row">
          <DialpadPage onChange={this.dialpadChanged.bind(this)}/>
        </div>
      </div>
    );
  }
}

CallPage.propTypes = {
  connection : React.PropTypes.object.isRequired,
  to : React.PropTypes.string,
  from : React.PropTypes.string.isRequired
};
