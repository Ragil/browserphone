import $ from 'jquery';
import gapi from 'src/common/gapi';
import React from 'react';
import '!style!css!less!./contact_img_page.less';


export default class ContactImgPage extends React.Component {
  render() {
    let photoEl;
    if (this.props.contact && this.props.contact.photoLink) {
      let photoLink = this.props.contact.photoLink + '?' + $.param({
        access_token : gapi.auth.getToken().access_token
      });

      photoEl = (
        <div className="contact-img-page-icon-container">
          <img src={photoLink} />
        </div>
      );
    } else {
      photoEl = (
        <div className="contact-img-page-icon-container contact-img-page-no-image">
          <span className="glyphicon glyphicon-user"></span>
        </div>
      );
    }

    return (
      <div className="contact-img-page">
        {photoEl}
      </div>
    );
  }
}

ContactImgPage.propTypes = {
  contact : React.PropTypes.object
}
