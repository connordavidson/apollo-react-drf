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
import { fetchCart } from "../store/actions/cart";
import { logout } from "../store/actions/auth";

import { authAxios } from '../utils';
import { orderItemDeleteURL, orderItemUpdateQuantityURL, addToCartURL } from '../constants';


class CustomLayout extends React.Component {

  componentDidMount() {
    //grabs the cart data every time the layout is rendered
    this.props.fetchCart();

    //this.handleSetUsername(this.props.username)

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
  handleRemoveQuantityFromCart = (slug , title) => {
    //filled in this function at https://youtu.be/8UEZsm4tCpY?t=1210
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
  }



  render() {
    //instantiates constants from the props
    const { authenticated, cart, loading, username } = this.props;

    return (
      <div>
        <Menu inverted size='huge'>

            <Link to="/">
              <Menu.Item header><h1>Apollo</h1></Menu.Item>
            </Link>

            <Menu.Menu position='right' >

              {/* displays the cart dropdown  */}

                <Dropdown
                    icon='cart'
                    loading= {loading}
                    text= { `${ cart!== null ? cart.order_items.length : 0} ` }
                    pointing
                    className='link item'
                    direction='left'
                  >

                  <Dropdown.Menu>
                    { cart !== null ? (
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
                                      {order_item.item.title}
                                    </Message.Header>
                                    <p>

                                      <Label>
                                        <Icon
                                          name='minus'
                                          color='red'
                                          style={{cursor: 'pointer'}}
                                          onClick={ () =>
                                            this.handleRemoveQuantityFromCart(order_item.item.slug, order_item.item.title)}
                                        />
                                        {order_item.quantity}

                                        <Label.Detail>
                                          <Icon
                                            name='plus'
                                            color='green'
                                            style={{cursor: 'pointer'}}
                                            onClick={ () =>
                                              this.handleAddToCart(
                                                order_item.item.slug,
                                                order_item.item_variations,
                                                order_item.item.title
                                              )}
                                          />
                                        </Label.Detail>

                                      </Label>

                                      <Icon
                                        name='trash'
                                        color='red'
                                        style={{float: 'right', cursor: 'pointer'}}
                                        onClick={ () => this.handleRemoveItem(order_item.id) }
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



        {this.props.children}

        <Segment
          inverted
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
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch( fetchCart() )
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
