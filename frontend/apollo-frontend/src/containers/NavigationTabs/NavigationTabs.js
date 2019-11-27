import React from 'react';

import {
  Tab,
} from 'semantic-ui-react'
import {withRouter} from 'react-router';

import BuyTab from './BuyTab';
import FundTab from './FundTab';

const panes = [
  //tabpane makes the tab have an outline around the content
  { menuItem: 'Buy Something',  render: () => <Tab.Pane>  <BuyTab/>  </Tab.Pane> },
  { menuItem: 'Fund a Project', render: () => <Tab.Pane> <FundTab/> </Tab.Pane> },
  { menuItem: 'Personal Items', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  { menuItem: 'Home',           render: () => <Tab.Pane>
    <p>
      <p> Welcome to our website!</p>
      <p> Our website is a website that sells things for and uses several different cryptocurrencies </p>
      <p> In order to keep our ui simple, we base everything on the USD and convert it to a cryptocurrency of your choice</p>
      <p> If you want to see the conversion from USD to one of the cryptocurrencies that we offer, just hover over the price for a second and a "popup" will show you that value in cryptocurrency </p>
    </p>
    <br />
    <br />
    <p> somn somn about 'we recomend this for you',</p>
    <p> somn somn about 'these are our hot products/projects/sales right now',</p>
    <p> somn somn about 'these are your recent orders/donations/purchases, buy it again??'</p>
    <p> somn somn about 'your order is ____ days/cities/miles away from being delivered'</p>
    <p> somn somn about 'welcome to our website! this is what we do blah blah blah'</p>
    <p> somn somn about 'how do you like your new ____? write a review for it' </p>
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
