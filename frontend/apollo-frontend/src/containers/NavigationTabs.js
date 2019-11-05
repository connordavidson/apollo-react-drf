import React from 'react';

import {
  Tab,
  Container,

} from 'semantic-ui-react'

import BuyTab from './BuyTab';



const panes = [
  //tabpane makes the tab have an outline around the content
  { menuItem: 'Buy Something', render: () => <Tab.Pane>  <BuyTab/>  </Tab.Pane> },
  { menuItem: 'Fund a Project', render: () => <Tab.Pane> Tab 2 Content</Tab.Pane> },
  { menuItem: 'Personal Items', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
]


class NavigationTabs extends React.Component {
  render(){
    return(
      <Container textAlign='center'>
        <Tab panes={panes} />
      </Container>
    )
  }
}



export default NavigationTabs;
