import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Button,
  Card,
  Icon,
  Message,
  Label,

} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ls from 'local-storage';


import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  decreaseItemQuantity,

 } from "../store/actions/cart";
import { logout } from "../store/actions/auth";
import { authAxios } from '../utils';
import {
  orderItemDeleteURL,
  orderItemUpdateQuantityURL,
  addToCartURL,

} from '../constants';

/*

  for keeping the dropdown open: onClick () => open = True

*/


class CustomLayout extends React.Component {

  componentDidMount() {
    //grabs the cart data every time the layout is rendered
    //this.props.fetchCart();
    ls.set('cart', this.props.cart)

    console.log('this.props.cart in componentDidMount: ' , this.props.cart)
  }

  componentWillUnmount() {
    console.log('this.props.cart in componentWillUnmount: ' , this.props.cart)

    ls.set('cart', this.props.cart)
  }

  componentDidUpdate(prevProps){
    console.log('this.props.cart in componentDidUpdate: ' , this.props.cart)
    if(this.props.cart === prevProps.cart){
      console.log('this.props.cart in componentDidUpdate: ' , this.props.cart)
       ls.set('cart', this.props.cart)
    }
  }


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

  //sends the information to the database, then calls fetchCart() to retrieve that information.... like a circle
  handleAddToCart = (data, quantity) => {
    this.setState({ loading: true });
    this.props.addItemToCart(data, 1)
    this.setState({loading: false});
  }


  //needs to decrement the quantity in the cart, if quantity is 1 then it should remove the item from the cart
  handleRemoveQuantityFromCart = (itemID, quantity) => {
    console.log('itemID from removeQuantity: ', itemID )
    console.log('quantity from removeQuantity: ', quantity )
    this.setState({ loading: true });
    if(quantity > 1){
      this.props.decreaseItemQuantity(itemID)
    } else {
      this.handleRemoveItem(itemID)
    }
    this.setState({ loading: false });
  }



  handleRemoveItem = (itemID) => {
    this.setState({loading : true})
    this.props.removeItemFromCart(itemID)
    this.setState({loading : false})
  }



  render() {
    //instantiates constants from the props
    const { authenticated, cart, loading, username } = this.props;

    //console.log('cart from customlayout render(): ', this.props.cart)

    return (
      <div>
        <Menu color='blue' inverted size='huge'>

            <Link to="/">
              <Menu.Item header>
                Apollo
              </Menu.Item>
            </Link>

            <Menu.Menu position='right' >

              {/*
                displays the cart dropdown
              */}

                <Dropdown
                    icon='cart'
                    loading= {loading}
                    text= { `${ cart!== null && cart.order_items.length > 0 ? cart.order_items.length : 0} ` }
                    pointing
                    className='link item'
                    direction='left'

                  >

                  <Dropdown.Menu>
                    { cart !== null  && cart.order_items.length > 0? (
                        <React.Fragment>
                          {
                            cart.order_items.map(order_item => {
                              return(
                                <Dropdown.Item
                                  key={order_item.id}
                                  style={{ cursor: 'auto'}}
                                >
                                  <Message
                                    fluid
                                    style={{backgroundColor: 'white'}}
                                  >
                                    <Message.Header
                                      onClick={() => this.props.history.push(`/products/${order_item.item.id}`)}
                                      style={{cursor: 'pointer'}}
                                    >
                                      {
                                        //trims titles that are longer than 22 characters... so that the dropdown isn't obnoxiously wide
                                        order_item.item.title.length > 22 ?
                                        order_item.item.title.substring(0, 22) + '...' :
                                        order_item.item.title
                                      }
                                    </Message.Header>
                                    <p>

                                      <Label>
                                        <Icon
                                          name='minus'
                                          color='red'
                                          style={{cursor: 'pointer'}}
                                          onClick={ () =>
                                            this.handleRemoveQuantityFromCart(order_item.item.id, order_item.quantity)}
                                        />

                                        {order_item.quantity}

                                        <Label.Detail>
                                          <Icon
                                            name='plus'
                                            color='green'
                                            style={{cursor: 'pointer'}}
                                            onClick={ () =>
                                              this.handleAddToCart( order_item.item, 1 )}
                                          />
                                        </Label.Detail>

                                      </Label>

                                      <Icon
                                        name='trash'
                                        color='red'
                                        style={{float: 'right', cursor: 'pointer'}}
                                        onClick={ () => this.handleRemoveItem(order_item.item.id) }
                                      />
                                    </p>
                                  </Message>
                                </Dropdown.Item>
                              );
                            })
                          }

                          <Dropdown.Divider />
                          {/* link to the checkout page */}
                          <Dropdown.Item
                            icon='arrow right'
                            onClick={ () => this.props.history.push('/order-summary') }
                          >
                            <Message style={{backgroundColor: 'white'}}>
                              Checkout
                              <Icon
                                name='arrow right'
                              />
                            </Message>

                          </Dropdown.Item>
                          />
                        </React.Fragment>
                      ) : (
                        <Dropdown.Item >
                          No items in your cart
                        </Dropdown.Item>
                      )
                    }
                  </Dropdown.Menu>
              </Dropdown>


            {/*displays the logout button if the user is logged in*/}
            {authenticated ? (
              <React.Fragment>
                <Menu.Item onClick={() => this.props.history.push(`/profile`)}>
                  Account
                </Menu.Item>
                <Menu.Item onClick={ () => logout() }>
                  Logout
                </Menu.Item>
              </React.Fragment>
            ) : (
              // displays the login/signup buttons if the user is not logged in
              <React.Fragment>

                <Link to="/login">
                  <Menu.Item header>Login</Menu.Item>
                </Link>
                <Link to="/signup">
                  <Menu.Item header>Signup</Menu.Item>
                </Link>

              </React.Fragment>
              )}


            </Menu.Menu>

        </Menu>

        {

          this.props.children
        }

        <Segment
          inverted
          secondary
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 1" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 2" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 3" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Footer Header" />
                <p>
                  Extra space for a call to action inside the footer that could
                  help re-engage users.
                </p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size="mini" src="/logo.png" />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch( fetchCart() ),
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
    )(CustomLayout)
);
