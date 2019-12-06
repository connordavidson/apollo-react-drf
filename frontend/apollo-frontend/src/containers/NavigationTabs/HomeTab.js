import React from 'react';

import {
  Container
} from 'semantic-ui-react';


class HomeTab extends React.Component {

  render() {
    return(
      <React.Fragment>
        <Container text>
        <p>
          <p> Welcome to our website!</p>
          <p> Apollo is a website that is based around using your cryptocurrency. </p>
          <p> We are an ecommerce and crowdfunding company. We sell hundreds/thousands/millions of items and are helping hundreds/thousands/millions of people raise money for projects. We also help hundreds/thousands/millions of people sell their stuff for cryptocurrency. </p>
          <p> In order to provide a simple experience for our users, we display all of our prices in their USD equivalent and convert it to the cryptocurrency of your choice</p>
          <p> If you want to see the conversion from USD to one of the cryptocurrencies that we offer, just hover over the price for a second and a "popup" will show you that value in cryptocurrency </p>
          <p> Don't know much about cryptocurrency? <a href='#'>Click here to learn more</a> </p>
        </p>
        <br />
        <br />
        <p> somn somn about 'we recomend this for you',</p>
        <p> somn somn about 'these are our hot products/projects/sales right now',</p>
        <p> somn somn about 'these are your recent orders/donations/purchases, buy it again??'</p>
        <p> somn somn about 'your order is ____ days/cities/miles away from being delivered'</p>
        <p> somn somn about 'welcome to our website! this is what we do blah blah blah'</p>
        <p> somn somn about 'how do you like your new ____? write a review for it' </p>
        </Container>
      </React.Fragment>
    )
  }
}


export default HomeTab
