import React from 'react';
import {
  Button,
  Container,
  Header,
  Icon,
  Label,
  Menu,
  Table,
  Message,
  Segment,
  Dimmer,
  Loader,
  Grid,
  Divider,
  Card,

} from 'semantic-ui-react';

import {connect} from 'react-redux';
import { Link, Redirect} from 'react-router-dom';


import { authAxios } from '../utils';
import {
  orderSummaryURL,
  orderItemDeleteURL,
  addToCartURL,
  orderItemUpdateQuantityURL,

 } from '../constants';



 /*
 fix issue where page refresh redirects to home.js on page refresh. has something to do with authentication
 fix issue where the page will display even if there are no items in the cart... need to find sizeof(order) in OrderQuantityUpdateView and then delete the order when it is 0

 */

class OrderSummary extends React.Component {

    state = {
      data: null,
      error: null,
      loading: false,
      decreased: false,
      increased: false
    }

    componentDidMount(){
      this.handleFetchOrder();
      console.log(this.state.data)
    }


    handleFetchOrder = () => {
      this.setState({loading: true});
      authAxios
        .get(orderSummaryURL)
        .then(res => {

          //res.data.order_items.data
          console.log("RESPONSE (res.data ): " ,  res.data   );
          //dispatches the cartSuccess method with data
          this.setState( { data: res.data , loading: false } );
        })
        .catch(err => {
          //made this around https://youtu.be/Vm9Z6mm2kcU?t=207
          //this is what gets triggered if there is no current order
          if(err.status === 404){
            console.log(err.reponse);
            this.setState({
              error: "You currently do not have an order" ,
              loading: false
            });
          } else{
            this.setState( {error: err, loading: false} );
          }
        });
    };

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

    //made at https://youtu.be/8UEZsm4tCpY?t=581
    //explanation around https://youtu.be/8UEZsm4tCpY?t=510
    handleAddToCart = (slug, itemVariations, title) => {
      this.setState({ loading: true });
      //filters  the data into the correct format fot the backend
      const variations = this.handleFormatData(itemVariations);
      //authAxios makes sure that the user is signed in before adding to cart... just use axios for adding to cart while signed out
      authAxios
      .post( addToCartURL , { slug, variations } )
      .then(res => {
        console.log(res.data, addToCartURL, "add to cart succeeded");
        this.handleFetchOrder();
        this.setState({ loading: false, increased: `${title} increased by 1!`, decreased: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
        console.log(err , 'add-to-cart failed ');
      });
    }

    //made around https://youtu.be/8UEZsm4tCpY?t=815
    //needs to decrement the quantity in the cart, if quantity is 1 then it should remove the item from the cart
    handleRemoveQuantityFromCart = (slug , title, quantity, itemID) => {
      //filled in this function at https://youtu.be/8UEZsm4tCpY?t=1210

      if(quantity > 1){
        authAxios
        .post( orderItemUpdateQuantityURL, { slug } )
        .then(res => {
          //callback
          this.handleFetchOrder();
          this.setState( {decreased: ` ${title} decreased by 1`, increased: false})
        })
        .catch(err => {
            this.setState( {error: err} );
        });
      } else {
        this.handleRemoveItem(itemID)
      }
    }

    //made at https://youtu.be/8UEZsm4tCpY?t=150
    handleRemoveItem = (itemID) => {
      authAxios
      .delete( orderItemDeleteURL(itemID) )
      .then(res => {
        //callback
        this.handleFetchOrder();
      })
      .catch(err => {
          this.setState( {error: err} );
      });
    }


    render(){

      const {data, error, loading, increased, decreased} = this.state;
      //redirects the user if they aren't authenticated (if their login times out)
      const {isAuthenticated} = this.props ;

      //for some reason, this redirects to home.js on page refresh
      // if(!isAuthenticated){
      //   return <Redirect to='/login' />;
      //   console.log("you were redirected becuase you were not authenticated");
      // }

      console.log("data: ", data);

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
            data&&
            <React.Fragment>

              {/*based on the layout of checkout.js*/}
              <Grid>
                {/*row for holding the header*/}
                <Grid.Row>
                  <Grid.Column width={3}>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <h1>Review your cart</h1>
                    <Divider/>
                  </Grid.Column>
                  <Grid.Column width={4}>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  {/*empty filler column to help with spacing of the rest of the page, probably can do this with some type of offset, not sure though*/}
                  <Grid.Column width={3}>
                  </Grid.Column>

                  <Grid.Column width={9}>
                    <Card.Group>
                      {
                        data.order_items.map(item => {
                          console.log('item inside order_items: quantity: ', item.quantity)
                          return(
                            <Card>
                              <Card.Content>
                                <Card.Header>
                                  {item.item.title}
                                </Card.Header>

                                <Card.Content>
                                  {item.item_variations ?
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
                                  <Label>
                                    <Icon
                                      name='minus'
                                      color='red'
                                      style={{cursor: 'pointer'}}
                                      onClick={ () =>
                                        this.handleRemoveQuantityFromCart(item.item.slug, item.item.title, item.quantity, item.id)}
                                    />
                                    {item.quantity}
                                    <Label.Detail>
                                      <Icon
                                        name='plus'
                                        color='green'
                                        style={{cursor: 'pointer'}}
                                        onClick={ () =>
                                          this.handleAddToCart(
                                            item.item.slug,
                                            item.item_variations,
                                            item.item.title
                                          )}
                                      />
                                    </Label.Detail>
                                  </Label>
                                  <Icon
                                    name='trash'
                                    color='red'
                                    style={{float: 'right', cursor: 'pointer'}}
                                    onClick={ () => this.handleRemoveItem(item.id) }
                                  />
                                </Card.Description>

                              </Card.Content>
                            </Card>
                          )
                        })
                      }

                    </Card.Group>
                  </Grid.Column>

                  <Grid.Column width={4}>
                    <Header>Go to checkout</Header>
                      <Card>
                        <Card.Content>
                          <Button
                            fluid
                            color='yellow'
                            onClick={ () => this.props.history.push(`/checkout`) }
                            >
                            Checkout
                          </Button>
                        </Card.Content>
                      </Card>

                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </React.Fragment>
          }
        </React.Fragment>
      )
    }
}

//made at https://youtu.be/8UEZsm4tCpY?t=900
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}


export default connect(mapStateToProps)(OrderSummary);
