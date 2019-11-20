import React, {Component} from 'react';

import {
    Container,
    Header,
    Grid,
    Divider,
    Button,
    Card,
    Icon,
    Segment,

  } from 'semantic-ui-react';



import {authAxios} from '../../utils';





class MyOrders extends React.Component {

  // state = {
  //
  //
  //
  // }

  render(){



    return(


      <Container>
        <Header as='h1'>Your Orders </Header>
        <Divider />
        <Grid>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Order Contents
              </Card.Header>

              <Card.Meta>
                Delivered at 2:30 on 11/8/2019
              </Card.Meta>

              <Card.Description>
                paid: $____/B_____
                <p>order description. this is the description of the order</p>
                <p>fulfilled by UPS fulfillment services </p>
                <p>Ship to <a>Connor Davidson</a> (links to shipping info) </p>
                
              </Card.Description>

              </Card.Content>


              <Card.Content extra>
              <Button>
                Buy it Again
                <Icon name='cart plus' floated='right' />
              </Button>

              <Button  >
                Write a Review
                  <Icon name='write square' corner floated='right' />
              </Button>

              <Button>
                Track Your Item
              </Button>

              <Button>
                Return Your Item
              </Button>

              <Button>
                Cancel Your Item
              </Button>
            </Card.Content>
          </Card>


        </Grid>
      </Container>


    )
  }
};




export default MyOrders;
