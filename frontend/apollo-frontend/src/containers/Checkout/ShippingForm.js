import React, {Component} from 'react';
import {
    Button,
    Container,
    Message,
    Item,
    Divider,
    Header,
    Loader,
    Segment,
    Dimmer,
    Icon,
    Label,
    Checkbox,
    Form,
    Select,
    Grid,
    Breadcrumb,
    Card,
    Input,

  } from 'semantic-ui-react';


  import {
      checkoutURL,
      orderSummaryURL,
      addCouponURL,
      addressListURL,
      countryListURL,

    } from '../../constants';

  import {authAxios} from '../../utils';

/*

***NEED TO DO***
use the UPS shipping api to determine how much to charge for shipping with UPS (the address should be coming from the AddressForm component (through parent BreadCrumbs))
  https://www.ups.com/us/en/services/technology-integration/online-tools-rates-svc.page?

*/


   class ShippingForm extends Component {
    //insert logic to retrieve available shipping optins for the address given in the previous breadcrumb

    render() {
      return(
        <React.Fragment>
          <Header>Select a shipping option</Header>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>2 Day Shipping</Card.Header>
                <Card.Meta>Friends of Elliot</Card.Meta>
                <Card.Description>
                  arrives in 2 business days
                </Card.Description>
              </Card.Content>
              <Card.Content>
                  $75.16
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <Card.Header>3-5 Day Shipping</Card.Header>
                <Card.Meta>Friends of Elliot</Card.Meta>
                <Card.Description>
                  arrives in 3-5 business days
                </Card.Description>
              </Card.Content>
              <Card.Content>
                  $50.16
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <Card.Header>7-10 Day Shipping</Card.Header>
                <Card.Meta>Friends of Elliot</Card.Meta>
                <Card.Description>
                  arrives in 7-10 business days
                </Card.Description>
              </Card.Content>
              <Card.Content>
                  FREE.99 boiiii
              </Card.Content>
            </Card>

          </Card.Group>
        </React.Fragment>


      )
    }
  }


export default ShippingForm
