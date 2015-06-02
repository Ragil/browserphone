import _ from 'lodash';
import bootstraputil from 'src/common/bootstraputil';
import React from 'react';
import '!style!css!less!./tab_page.less';


export default class TabPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (!props.tabs || props.tabs.length === 0) {
      throw new Error('more than 1 tab is required');
    }
  }

  render() {
    let selectedTab = _.find(this.props.tabs, (tab) => {
      return tab.selected;
    });
    selectedTab = selectedTab || this.props.tabs[0];

    let navigation = _.map(this.props.tabs, (tabdata, index) => {
      let activeClass = tabdata === selectedTab ? ' active ' : '';
      return (
        <li className={"tab-page-nav-entry" + activeClass} key={index}>
          <a href={tabdata.href}>
            {tabdata.title}
          </a>
        </li>
      );
    }, this);

    return (
      <div className='tab-page row'>
        <ul className={'tab-page-nav nav nav-tabs' + bootstraputil.col(12)}>
          {navigation}
        </ul>
        <div className={'tab-page-content' + bootstraputil.col(12)}>
          {selectedTab.component}
        </div>
      </div>
    );
  }
}

TabPage.propTypes = {
  // [TabData]
  tabs : React.PropTypes.array.isRequired
};
