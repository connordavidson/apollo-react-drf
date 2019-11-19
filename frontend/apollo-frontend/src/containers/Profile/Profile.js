import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Grid,
  Card,
  Container,
  Divider,
  Header,

  } from 'semantic-ui-react';

import {
    addressListURL,
    addressCreateURL,
    countryListURL,
    userIDURL,
    addressUpdateURL,
    addressDeleteURL,
    paymentListURL,

  } from '../../constants';

import {authAxios} from '../../utils';



class Profile extends React.Component {
  // state = {
  //
  // }

  render() {


    return(
      <Container >
        <Header as='h1'>Account</Header>
        <Divider/>
        <Grid>
          <Grid.Column width={5}>
            <Card>
              <Card.Content>
                <Card.Header>
                  My Orders
                </Card.Header>
                <Card.Description>
                  Details for all of your past orders, active and delivered
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <Card.Header>
                  Sell with Apollo
                </Card.Header>
                <Card.Description>
                  Do you own a business and want to become a merchant with Apollo? click here
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>

          <Grid.Column width={5}>
            <Card>
              <Card.Content>
                <Card.Header>
                  Past Project Donations
                </Card.Header>
                <Card.Description>
                  Check on the status of all your project donations!
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <Card.Header>
                  Start a Project
                </Card.Header>
                <Card.Description>
                  Do you have a stellar idea for something that doesn't already exist? click here
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>

          <Grid.Column width={5}>
            <Card>
              <Card.Content>
                <Card.Header>
                  Account Information
                </Card.Header>
                <Card.Description>
                  Make changes to your account information
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
};


// made at https://youtu.be/QDKHL83tpSE?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=1615
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}


export default connect(mapStateToProps)(Profile);
