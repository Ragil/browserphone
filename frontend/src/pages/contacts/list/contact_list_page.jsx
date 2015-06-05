import React from 'react';
import ContactPage from './contact_page.jsx';


export default class ContactListPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let contacts = _.chain(this.props.entries)
        .take(20)
        .map((contact, index) => {
          return <ContactPage contact={contact} key={index} />;
        }).value();

    return (
      <div className="contact-list-page row">
        {contacts}
      </div>
    );
  }
}

ContactListPage.propTypes = {
  entries : React.PropTypes.array.isRequired
};
