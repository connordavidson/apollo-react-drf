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
    Label,
    Image,

  } from 'semantic-ui-react';



import {authAxios} from '../../utils';

import {
  allOrdersURL,

  } from '../../constants';



/*
This page is designed to show the user their past orders

it just pulls data in from the backend and displays it.

There will need to be changes in the backend that create a "OrderItemOrder" type of model
  this is needed because an order can be split up (for any number of reasons ie. different items in different warehouses)
  and those new 'OrderItemOrder' orders will need to have data that is required of an Order (ie. being able to track each order item individually, instead of tracking the order as a whole)


**need to change**
figure out how to have multiple buttons on the individual item card

***NEED to DO***
display the up-to-date shipping info per item using the UPS shipping api
  https://www.ups.com/us/en/services/technology-integration/online-tools-tracking.page?

*/







class MyOrders extends React.Component {

  state = {
    data: null,
    loading: false,

  }

  componentDidMount(){
    this.handleGetAllOrders();
  }


  handleGetAllOrders = () => {
    this.setState({
      loading: true
    })

    authAxios
      .get(allOrdersURL)
      .then(res => {
        //res.data.order_items.data
        //console.log("RESPONSE (res.data ): " ,  res.data   );

        //dispatches the cartSuccess method with data
        this.setState( { data: res.data , loading: false } );

        console.log('res.data from handleGetAllOrders: ' , res.data)
      })
      .catch(err => {
        //made this around https://youtu.be/Vm9Z6mm2kcU?t=207
        //this is what gets triggered if there is no current order
        if(err.status === 404){
          console.log(err.reponse);
          this.setState({
            error: "You currently do not have any orders yet" ,
            loading: false
          });
        } else{
          this.setState( {error: err, loading: false} );
        }
      });
  }

  //formats the UTC into mm/dd/yyy format to display in the order info
  handleMakeDate = (oldDate) => {
    let newDate = new Date(oldDate);
    return( (newDate.getMonth() + 1).toString() + "/" + newDate.getDate().toString() + "/" + newDate.getFullYear().toString() )
  }


  render(){

    const {
      data,
      loading,
      error,

    } = this.state

    return(

      <Container>
        <Header as='h1'>Your Orders </Header>
        <Divider />
        {
          data !== null ?
            data.map( order => {
              return(
                <React.Fragment>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header as='h2'>
                        Order for {order.shipping_address.user}
                      </Card.Header>

                      <Label basic color='blue'>
                        Order total: ${order.total}
                      </Label>
                      <Label basic color='blue'>
                        Ordered on: { this.handleMakeDate(order.ordered_date) }
                      </Label>

                      {order.being_delivered &&
                        <Label as='a' basic color='blue'>
                          Track your item: {order.tracking_number}
                        </Label>
                      }
                      {order.received &&
                        <React.Fragment>
                          <Label as='a' basic color='blue'>
                            Track your item: {order.tracking_number}
                          </Label>
                          <Label basic color='blue'>
                            <Icon name='check' />
                            Your order has been delivered
                          </Label>
                        </React.Fragment>
                      }
                    </Card.Content>
                    <Card.Content>
                      <Card.Group>
                        {
                          order.order_items.map( item => {
                            //cards should link to a 'order page' page which gives more details about that order
                            return(
                              <Card
                                href
                                style={{width : ' 32%'}}
                              >
                                <Card.Content>
                                  <Card.Header>
                                    {
                                      item.item.title.length > 30 ?
                                      item.item.title.substring(0,30) + '...':
                                      item.item.title
                                    }
                                  </Card.Header>
                                  <Card.Meta>
                                    Quantity: {item.quantity}
                                  </Card.Meta>
                                  <Card.Meta>
                                    Total: ${item.final_price}
                                  </Card.Meta>
                                </Card.Content>

                                <Card.Content extra >

                                    <Label basic color='green'>
                                      Order again
                                      <Icon name='cart plus' floated='right' />
                                    </Label>

                                    <Label  basic color='yellow' >
                                      Write Review
                                        <Icon name='write square' floated='right' />
                                    </Label>

                                    <Label basic color='blue'>
                                      Return Item
                                    </Label>

                                </Card.Content>
                              </Card>
                            )
                          })
                        }
                      </Card.Group>
                    </Card.Content>

                    <Card.Content extra>
                      <Button basic color='green'>
                        Order Again
                        <Icon name='cart plus' floated='right' />
                      </Button>

                      <Button basic color='black'>
                        Track Your Order
                      </Button>

                      <Button basic color='red'>
                        Cancel This Order
                      </Button>
                    </Card.Content>

                  </Card>

                  <Divider />
                </React.Fragment>
              )
            })

          :
            <Header as='h3'>{error}</Header>
        }


      </Container>
    )
  }
};




export default MyOrders;
