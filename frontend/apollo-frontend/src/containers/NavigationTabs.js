import React from 'react';

import {
  Tab,
  Container,

} from 'semantic-ui-react'

import BuyTab from './BuyTab';
import {withRouter} from 'react-router';


const panes = [
  //tabpane makes the tab have an outline around the content
  { menuItem: 'Buy Something',  render: () => <Tab.Pane>  <BuyTab/>  </Tab.Pane> },
  { menuItem: 'Fund a Project', render: () => <Tab.Pane> Tab 2 Content</Tab.Pane> },
  { menuItem: 'Personal Items', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  { menuItem: 'Home',           render: () => <Tab.Pane>
    <p> somn somn about 'we recomend this for you',</p>
    <p> somn somn about 'these are our hot products/projects/sales right now',</p>
    <p> somn somn about 'these are your recent orders/donations/purchases, buy it again??'</p>
    <p> somn somn about 'your order is ____ days/cities/miles away from being delivered'</p>
    <p> somn somn about 'welcome to our website! this is what we do blah blah blah'</p>

  </Tab.Pane> },

]


class NavigationTabs extends React.Component {
  render(){
    return(
        <Tab panes={panes} />
    )
  }
}



export default withRouter(NavigationTabs);
