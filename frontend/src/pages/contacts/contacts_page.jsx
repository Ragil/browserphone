import React from 'react';
import contacts from 'src/common/contacts/contacts';
import SearchPage from './search/search_page';
import ContactListPage from './list/contact_list_page';
import ReactSpinner from 'src/common/spin/spin';
import '!style!css!less!./contacts_page.less';


export default class ContactsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.allContacts = [];
    this.state = {
      searchText : '',
      loading : true
    };

    this.fetchContacts();
  }

  fetchContacts() {
    contacts.fetch(((contacts) => {

      this.allContacts = contacts;
      this.setState({ loading : false });
      this.doSearch(this.state.searchText);

    }).bind(this));
  }

  doSearch(searchText) {
    let filter = searchText.toLowerCase();
    let filtered;

    if (filter === '') {
      filtered = this.allContacts;
    } else {
      filtered = _.filter(this.allContacts, (contact) => {

        // filter by name
        let titleMatch = contact.fullname.toLowerCase().indexOf(filter) >= 0;

        // filter by number
        let numberMatch = _.find(contact.phones, (phone) => {
          return phone.replace(/-/g, '').replace('+', '').indexOf(filter) >= 0;
        }) ? true : false;

        return titleMatch || numberMatch;
      });
    }

    this.setState({
      searchText : searchText,
      filteredEntries : filtered
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="contacts-page">
          <div className="contacts-page-loader">
            <ReactSpinner />
            <div className="contacts-page-loading-message">
              Loading contacts
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="contacts-page">
        <div className="contacts-page-search">
          <SearchPage onChange={this.doSearch.bind(this)}
              value={this.state.searchText}/>
        </div>

        <div className="contacts-page-result">
          <ContactListPage entries={this.state.filteredEntries} />
        </div>
      </div>
    );
  }
}
