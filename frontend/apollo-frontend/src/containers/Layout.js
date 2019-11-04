import React from 'react';


class CustomLayout extends React.Component {
  render(){

    return(

      <Menu inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link>

            <Link to="/products">
              <Menu.Item header>Products</Menu.Item>
            </Link>

            <Menu.Menu position='right'>
            {/*displays the cart dropdown and the logout button if the user is logged in*/}
            {authenticated ? (

              <React.Fragment>

                <Link to='/profile'>
                  <Menu.Item >
                    Profile
                  </Menu.Item>
                </Link>

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
                                    <Dropdown.Item key={order_item.id}>
                                      {order_item.quantity} x {order_item.item.title} - | {this.renderVariations(order_item)}
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

                <Menu.Item header onClick={() => logout()}>
                  Logout
                </Menu.Item>


              </React.Fragment>

            ) : (
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
          </Container>
        </Menu>

    )
  }
}
