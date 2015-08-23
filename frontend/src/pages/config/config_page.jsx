import $ from 'jquery';
import bootstraputil from 'src/common/bootstraputil';
import contacts from 'src/common/contacts/contacts';
import gapi from 'src/common/gapi';
import env from 'env';
import React from 'react';
import ReactSpinner from 'src/common/spin/spin';
import "!style!css!less!./config_page.less";


export default class ConfigPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading : true,
      saving : false,
      data : undefined,
      json_data : undefined
    };

    this.load();
  }

  load() {
    this.setState({ loading : true });

    let user = 'google-token';
    let password = gapi.auth.getToken().access_token;

    $.ajax({
      url : env.service.user,
      username : user,
      password : password,
      beforeSend: function(req) {
        req.setRequestHeader('Authorization',
            'Basic ' + btoa(user + ':' + password));
      }
    }).done(((data, status, jqXHR) => {
      this.setState({
        loading : false,
        data : data,
        json_data : JSON.stringify(data, null, 4)
      });
    }).bind(this));
  }

  handleChange(event) {
    this.setState({json_data: event.target.value});
  }

  update(e) {
    e.preventDefault();

    let user = 'google-token';
    let password = gapi.auth.getToken().access_token;
    let value = JSON.parse($(this.refs.textarea.getDOMNode()).val());
    this.setState({ saving : true });

    value.phones = JSON.stringify(value.phones);

    $.ajax({
      url : env.service.user,
      method : 'POST',
      data : value,
      username : user,
      password : password,
      beforeSend: function(req) {
        req.setRequestHeader('Authorization',
            'Basic ' + btoa(user + ':' + password));
      }
    }).always(((data, status, jqXHR) => {
      this.setState({ saving : false });
      this.load();
    }).bind(this));
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="config-page">
          <div className="config-page-loader">
            <ReactSpinner />
            <div className="config-page-loading-message">
              Loading configs
            </div>
          </div>
        </div>
      );
    }

    let controlContent = [];
    if (!this.state.saving) {
      controlContent.push(
        <span>
          <button className="btn btn-success"
              onClick={this.update.bind(this)}
              disabled={this.state.saving}>
              Update
          </button>
        </span>
      );
    } else {
      controlContent.push(<ReactSpinner />);
    }

    return (
      <div className="config-page">
        <form>
          <div>
            <textarea name="value"
                ref="textarea"
                value={this.state.json_data}
                onChange={this.handleChange.bind(this)}
                readOnly={this.state.saving} />
          </div>
          {controlContent}
        </form>
      </div>
    );
  }
}
