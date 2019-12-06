import React from 'react';
import {
  Button,
  Header,
  Icon,
  Label,
  Message,
  Segment,
  Dimmer,
  Loader,
  Grid,
  Divider,
  Card,
  Container,

} from 'semantic-ui-react';
import {connect} from 'react-redux';
import { Link, Redirect, withRouter} from 'react-router-dom';
import ls from 'local-storage';


import {
    addItemToCart,
    removeItemFromCart,
    decreaseItemQuantity,

  } from '../store/actions/cart';
import { authAxios } from '../utils';
import {
  orderSummaryURL,
  orderItemDeleteURL,
  addToCartURL,
  orderItemUpdateQuantityURL,

 } from '../constants';

import IncreaseDecreaseQuantity from './IncreaseDecreaseQuantity';


 /*
 fix issue where page refresh redirects to home.js on page refresh. has something to do with authentication

 */


class OrderSummary extends React.Component {

    state = {
      error: null,
      loading: false,
      decreased: false,
      increased: false
    }


    //created at https://youtu.be/qJN1_2ZwqeA?t=2160
    renderVariations = (orderItem) => {
      let text = '';
      //loop through all the variations of the orderItem
      orderItem.item_variations.forEach(iv => {
        //ex: color: red , size: small
        text += `${iv.variation.name}: ${iv.value} ` ;
      })
      return text;
    }

    //made at https://youtu.be/8UEZsm4tCpY?t=675
    handleFormatData = (itemVariations) => {
      //returns the keys of the itemVariations array becuase that is what the backend is expecting
      //convert [{id: 1}, {id: 2}] to [1,2]
      return Object.keys(itemVariations).map(key =>{
        //"for every object in the array return the id"
        return itemVariations[key].id;
      })
    }

    handleAddToCart = (data, quantity) => {
      this.setState({ loading: true });
      this.props.addItemToCart(data, quantity)
      this.setState({loading: false});
    }


    handleRemoveQuantityFromCart = (itemID, quantity) => {
      this.setState({ loading: true });
      if(quantity > 1){
        this.props.decreaseItemQuantity(itemID)
      } else {
        this.props.removeItemFromCart(itemID)
      }
      this.setState({ loading: false });
    }

    handleRemoveItem = (itemID) => {
      this.setState({loading : true})
      this.props.removeItemFromCart(itemID)
      this.setState({loading : false})
    }


    updateCart = (oldCart, newCart) => {
      oldCart = newCart;
    }




    render(){

      const {
        //data,
        error,
        loading,
        increased,
        decreased
      } = this.state;
      //redirects the user if they aren't authenticated (if their login times out)
      const {
        isAuthenticated,
        cart,
      } = this.props ;

      //for some reason, this redirects to home.js on page refresh
      // if(!isAuthenticated){
      //   return <Redirect to='/login' />;
      //   console.log("you were redirected becuase you were not authenticated");
      // }

      //console.log("data: ", cart);

      return(
        <React.Fragment>
          <div>
            {
              error &&
              <Message
                error
                header="There was an error"
                content={JSON.stringify(error)}
              />
            }

            {
              loading &&
              <Segment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Segment>
            }

            {
              increased &&
              <Message
                positive
                header="Thanks!"
                content={increased}
              />
            }

            {
              decreased &&
              <Message
                error
                header="Changed your mind?"
                content={decreased}
              />
            }
          </div>

          {

          cart &&

            <React.Fragment>

              <Container>

                <Header as='h1'>Review your cart</Header>
                <Divider />
                {console.log('cart.order_items : ' , cart.order_items)
                /*based on the layout of checkout.js*/
              }
                <Grid>
                    <Grid.Column width={12}>
                      { cart.order_items.length > 0 ?
                        (<Card.Group>
                          {
                            cart.order_items.map(item => {
                              // console.log('item inside order_items ', item)
                              // console.log('item inside order_items: quantity: ', item.quantity)
                              return(
                                <Card>
                                  <Card.Content>
                                    <Card.Header>
                                      {
                                        item.item.title.length > 30 ?
                                        item.item.title.substring(0,30) + '...':
                                        item.item.title
                                      }
                                    </Card.Header>

                                    <Card.Content>
                                      {
                                        item.item_variations ?
                                        (this.renderVariations(item)) :
                                        null
                                      }
                                    </Card.Content>
                                    {
                                      item.item.discount_price !== null ?
                                      <Card.Meta>
                                        <s>${item.item.price}</s>
                                        ${item.item.discount_price}
                                      </Card.Meta> :
                                      <Card.Meta>
                                        ${item.item.price}
                                      </Card.Meta>
                                    }

                                    <Card.Description >

                                      <IncreaseDecreaseQuantity
                                        item={item}
                                        //updateCart={this.updateCart}
                                      />


                                      <Label>
                                        <Icon
                                          name='minus'
                                          color='red'
                                          style={{cursor: 'pointer'}}
                                          onClick={ () =>
                                            this.handleRemoveQuantityFromCart(item.item.id, item.quantity)}
                                        />

                                        {item.quantity}

                                        <Label.Detail>
                                          <Icon
                                            name='plus'
                                            color='green'
                                            style={{cursor: 'pointer'}}
                                            onClick={ () =>
                                              this.handleAddToCart(
                                                item.item,
                                                1
                                              )}
                                          />
                                        </Label.Detail>
                                      </Label>




                                      <Icon
                                        name='trash'
                                        color='red'
                                        style={{float: 'right', cursor: 'pointer'}}
                                        onClick={ () => this.handleRemoveItem(item.item.id) }
                                      />


                                    </Card.Description>

                                  </Card.Content>
                                </Card>
                              )
                            })
                          }

                        </Card.Group>
                      )
                      :
                      (
                        <Message
                          error
                          header='Your Cart Is Empty'
                          content='Oops! You have nothing in your cart right now. Get to shopping'
                        />
                      )
                      }
                    </Grid.Column>

                    <Grid.Column width={4}>
                      <Header>Go to checkout</Header>
                        <Card fluid>
                          <Card.Content>
                            <Button
                              disabled={cart.order_items.length > 0 ? false : true}
                              fluid
                              color='blue'
                              onClick={ () => this.props.history.push(`/checkout`) }
                              >
                              Checkout
                            </Button>
                          </Card.Content>
                        </Card>

                    </Grid.Column>

                </Grid>
              </Container>
            </React.Fragment>
          }
        </React.Fragment>
      )
    }
}

//made at https://youtu.be/8UEZsm4tCpY?t=900
const mapStateToProps = (state) => {
  return {
    //isAuthenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //mergeCartOnLogin: () => dispatch( mergeCartOnLogin() ),
    addItemToCart: (data, quantity) => dispatch(addItemToCart(data, quantity)),
    removeItemFromCart: (itemID) => dispatch( removeItemFromCart(itemID) ),
    decreaseItemQuantity: (itemID) => dispatch( decreaseItemQuantity(itemID) ),

  };
};


export default
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(OrderSummary)
  );
