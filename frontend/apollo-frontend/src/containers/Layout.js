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
  Icon
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCart } from "../store/actions/cart";
import { logout } from "../store/actions/auth";

import { authAxios } from '../utils';
import {orderItemDeleteURL } from '../constants';


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

  render() {
    //instantiates constants from the props
    const { authenticated, cart, loading, username } = this.props;

    return (
      <div>
        <Menu inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Apollo</Menu.Item>
            </Link>

            <Menu.Menu position='right'>
            {/*displays the logout button if the user is logged in*/}
            {authenticated ? (

              <React.Fragment>

                <Link to='/profile'>
                  {username !== null ?
                    <Menu.Item >
                      Hello, {username} !
                    </Menu.Item>
                  :
                  <Menu.Item >
                    Hello!
                  </Menu.Item>
                  }

                </Link>

                <Menu.Item header onClick={ () => logout() }>
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

              {/* displays the cart dropdown  */}

                <Dropdown
                    icon='cart'
                    loading= {loading}
                    // displays the number of items in the cart
                    text= { `${ cart!== null ? cart.order_items.length : 0} ` }
                    pointing
                    className='link item'
                  >

                  <Dropdown.Menu>
                    { cart !== null ? (
                        <React.Fragment>
                          {
                            cart.order_items.map(order_item => {
                              return(
                                <Dropdown.Item
                                  key={order_item.id}
                                >
                                  <Card >
                                    <Card.Content>
                                      <Card.Header onClick={() => this.props.history.push(`/products/${order_item.item.id}`)} >
                                        {order_item.item.title}
                                      </Card.Header>

                                      <Card.Meta>Quantity: {order_item.quantity}</Card.Meta>

                                      <Card.Description>
                                        {this.renderVariations(order_item)}
                                      </Card.Description>

                                      <Icon
                                        name='trash'
                                        color='red'
                                        style={{float: 'right', cursor: 'pointer'}}
                                        onClick={ () => this.handleRemoveItem(order_item.id) }
                                      />
                                    </Card.Content>
                                  </Card>
                                </Dropdown.Item>
                              );
                            })
                          }
                          <Dropdown.Divider />
                          {/* link to the checkout page */}
                          <Dropdown.Item
                            icon='arrow right'
                            text='Checkout'
                            onClick={ () =>
                              this.props.history.push('/order-summary')
                            }
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
            </Menu.Menu>
          </Container>
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
