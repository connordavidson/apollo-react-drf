import React from 'react';

import {
  Tab,
} from 'semantic-ui-react'
import {withRouter} from 'react-router';
import ls from 'local-storage';

import HomeTab from './HomeTab'
import BuyTab from './BuyTab/BuyTab';
import FundTab from './FundTab';



class NavigationTabs extends React.Component {

  //creates the activeTab in local storage right before the component mounts
  componentWillMount() {
    //if there is not currently an active tab stored in local storage, set it to be tab 0
    if(ls.get('activeTab') === null){
      ls.set('activeTab', 0)
    }
  }

  handleTabChange = (e, {activeIndex} ) => {
    ls.set('activeTab', activeIndex)
  }

  render(){
    const panes = [
      //tabpane makes the tab have an outline around the content
      { menuItem: 'Home',           render: () =>
        <Tab.Pane >
          <HomeTab />
        </Tab.Pane>
      },
      { menuItem: 'Buy Something',  render: () =>
        <Tab.Pane>
          <BuyTab/>
        </Tab.Pane>
      },
      { menuItem: 'Fund a Project', render: () =>
        <Tab.Pane>
          <FundTab/>
        </Tab.Pane>
      },
      { menuItem: 'Personal Items', render: () =>
        <Tab.Pane>
          This is where people will be able to buy personal items from other people. similar to craiglist or ebay.. need to decide exactly what direction to take.
        </Tab.Pane>
      },

    ]

    return(
        <Tab
          panes={panes}
          defaultActiveIndex={ls.get('activeTab')}
          onTabChange={this.handleTabChange}
        />
    )
  }
}

export default
  withRouter(
    (NavigationTabs)
);
