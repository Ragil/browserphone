import _ from 'lodash';
import bootstraputil from 'src/common/bootstraputil';
import React from 'react';


export default class TabPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (!props.tabs || props.tabs.length === 0) {
      throw new Error('more than 1 tab is required');
    }

    this.state = {
      selectedTab : this.props.tabs[0]
    };
  }

  render() {
    let navigation = _.map(this.props.tabs, (tabdata) => {
      let activeClass = tabdata === this.state.selectedTab ? ' active ' : '';
      return (
        <li className={"tab-page-nav-entry" + activeClass}>
          <a>
            {tabdata.title}
          </a>
        </li>
      );
    });

    return (
      <div className='tab-page row'>
        <ul className={'tab-page-nav nav nav-tabs' + bootstraputil.col(12)}>
          {navigation}
        </ul>
        <div className={'tab-page-content' + bootstraputil.col(12)}>
          {this.state.selectedTab.component}
        </div>
      </div>
    );
  }
}

TabPage.propTypes = {
  // [TabData]
  tabs : React.PropTypes.array.isRequired
};
