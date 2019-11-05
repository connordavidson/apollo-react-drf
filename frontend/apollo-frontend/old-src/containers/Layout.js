import React from 'react';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";

import { Link, withRouter } from "react-router-dom";


class CustomLayout extends React.Component {
  
  render(){

    return(

      <Menu inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Apollo</Menu.Item>
            </Link>

            <Menu.Menu position='right'>
            {/*displays the cart dropdown and the logout button if the user is logged in*/}
              <React.Fragment>

                <Link to='/profile'>
                  <Menu.Item >
                    Hello, ____!
                  </Menu.Item>
                </Link>

                <Menu.Item header >
                  Logout
                </Menu.Item>

                <Link to='/orders'>
                  <Menu.Item >
                    Orders
                  </Menu.Item>
                </Link>

                <Dropdown
                    icon='cart'
                    //loading= {loading}
                    // displays the number of items in the cart
                    text= { `Cart[__]` }
                    pointing
                    className='link item'
                  >
                  <Dropdown.Menu>
                    Dropdown Menu
                  </Dropdown.Menu>

                </Dropdown>

                <Menu.Item >
                  BTC: $___
                </Menu.Item>

              </React.Fragment>

            </Menu.Menu>
          </Container>
        </Menu>

    )
  }
}

export default CustomLayout;
