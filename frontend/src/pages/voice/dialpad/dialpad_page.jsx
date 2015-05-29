import bootstraputil from 'src/common/bootstraputil';
import env from 'env';
import React from 'react';
import '!style!css!less!./dialpad_page.less';
import gapi from 'src/common/gapi';
import global from 'src/common/global';


export default class DialpadPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value : this.props.value || ''
    };
  }

  onCall(e) {
    global.call.From = env.phoneNumber;
    global.call.To = this.state.value;

    Twilio.Device.connect({
      From: global.call.From,
      To: global.call.To,
      Direction: 'outbound',
      'google-token': gapi.auth.getToken().access_token
    });
  }

  onInputChange(e) {
    this.valueChanged(e.target.value);
  }

  valueChanged(newValue) {
    this.setState({
      value : newValue
    });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  keyPressed(e) {
    let key = e.target.attributes['data-key'].nodeValue;

    this.valueChanged(this.state.value + key);
    this.refs.inputComponent.getDOMNode().focus();
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      // enter key, ignore
      e.preventDefault();
      return;
    }
  }

  render() {
    let keys = _.map(this.keyLayout, (row) => {

      let rowKeys = _.map(row, (entry) => {
        let key = entry[0];

        return (
          <div className={"dialpad-page-key" + bootstraputil.col(4)}>
            <button className="btn btn-primary" data-key={key}
                onClick={this.keyPressed.bind(this)}>

              <div className="dialpad-page-key-primary" data-key={key}>
                {key}
              </div>
              <div className="dialpad-page-key-secondary" data-key={key}>
                {entry[1]}
              </div>

            </button>
          </div>
        );
      });

      return (
        <div className="dialpad-page-row row">
          {rowKeys}
        </div>
      );
    });

    let callBtn;
    if (this.props.allowCalling) {
      callBtn = (
        <span className="input-group-btn">
          <button className="btn btn-default btn-success" type="button"
              onClick={this.onCall.bind(this)}>
            <span className="glyphicon glyphicon-phone"></span>
          </button>
        </span>
      );
    }

    return (
      <div className="dialpad-page row">
        <form>
          <div className={"dialpad-page-value form-group" + bootstraputil.col(12)}>
            <div className={"input-group" + bootstraputil.col(12)}>
              <input type="text" className="form-control" value={this.state.value}
                  onChange={this.onInputChange.bind(this)} ref='inputComponent'
                  onKeyDown={this.onKeyDown.bind(this)}
                  placeholder="Enter number or use the dialpad"/>
              {callBtn}
            </div>
          </div>
        </form>

        <div className={"dialpad-page-keys" + bootstraputil.col(12)}>
          {keys}
        </div>
      </div>
    );
  }
}

DialpadPage.prototype.keyLayout = [
  [['1', ''], ['2', 'ABC'], ['3', 'DEF']],
  [['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO']],
  [['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']],
  [['*', ''], ['0', '+'], ['#', '']]
];

DialpadPage.propTypes = {
  allowCalling : React.PropTypes.boolean,
  value : React.PropTypes.string,
  onChange : React.PropTypes.func
};
