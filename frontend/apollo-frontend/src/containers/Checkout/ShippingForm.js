
import React, {Component} from 'react';


import {
  Header,
  Card,

} from 'semantic-ui-react';




 class ShippingForm extends Component {
  //insert logic to retrieve available shipping optins for the address given in the previous breadcrumb

  render() {
    return(
      <React.Fragment>
        <Header>Select a shipping option</Header>
        <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header>2 Day Shipping</Card.Header>
              <Card.Meta>Friends of Elliot</Card.Meta>
              <Card.Description>
                arrives in 2 business days
              </Card.Description>
            </Card.Content>
            <Card.Content>
                $75.16
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>3-5 Day Shipping</Card.Header>
              <Card.Meta>Friends of Elliot</Card.Meta>
              <Card.Description>
                arrives in 3-5 business days
              </Card.Description>
            </Card.Content>
            <Card.Content>
                $50.16
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>7-10 Day Shipping</Card.Header>
              <Card.Meta>Friends of Elliot</Card.Meta>
              <Card.Description>
                arrives in 7-10 business days
              </Card.Description>
            </Card.Content>
            <Card.Content>
                FREE.99 boiiii
            </Card.Content>
          </Card>

        </Card.Group>
      </React.Fragment>


    )
  }
}



export default ShippingForm;
