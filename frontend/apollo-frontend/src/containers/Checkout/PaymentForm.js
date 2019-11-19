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




class PaymentForm extends Component {
  //insert logic to retrieve available payment optins for the order total info given in the previous breadcrumbs

  render(){
    return(

      <React.Fragment>
        <Header>Select a currency</Header>
        <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header>Bitcoin</Card.Header>
              <Card.Meta>click to display a scannable QR code</Card.Meta>
              <Card.Description>
                <Input
                  action={{
                    icon: 'copy',
                  }}
                  defaultValue='47dm93050jd02jm,ka7ifa'
                />
              </Card.Description>
            </Card.Content>
            <Card.Content>
                $429104/<Label color='yellow'>₿1.3349103</Label>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>Litecoin</Card.Header>
              <Card.Meta>click to display a scannable QR code</Card.Meta>
              <Card.Description>
                <Input
                  action={{
                    icon: 'copy',
                  }}
                  defaultValue='158df8asdf50jd02jm,ka7ifa'
                />
              </Card.Description>
            </Card.Content>
            <Card.Content>
                $429104/ <Label color='blue'>Ł 19.3349103</Label>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>Ethereum ETH</Card.Header>
              <Card.Meta>click to display a scannable QR code</Card.Meta>
              <Card.Description>
                <Input
                  action={{
                    icon: 'copy',
                  }}
                  defaultValue='asdf791jfa9012jasdf09asd90f'
                />
              </Card.Description>
            </Card.Content>
            <Card.Content>
                $429104/ <Label color='teal'>4.3349103 ETH</Label>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>Ripple XRP</Card.Header>
              <Card.Meta>click to display a scannable QR code</Card.Meta>
              <Card.Description>
                <Input
                  action={{
                    icon: 'copy',
                  }}
                  defaultValue='a123asdfjakea9012jasdf09asd90f'
                />
              </Card.Description>
            </Card.Content>
            <Card.Content>
                $429104/ <Label color='grey'>4821.3349103 XRP</Label>
            </Card.Content>
          </Card>

        </Card.Group>
      </React.Fragment>
    )
  }
}


export default PaymentForm
