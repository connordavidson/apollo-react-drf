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
    Link,
    withRouter,

  } from 'react-router-dom';

import {authAxios} from '../utils';

import {
    checkoutURL,
    orderSummaryURL,
    addCouponURL,
    addressListURL

  } from '../constants';

/*
should display the checkout process through the breadcrumbs.
planning on making each part of the breadcrumbs it's own component


*/









//made this file at https://youtu.be/z7Kq6bHxEcI?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=426
//made major restructuring to this file around https://youtu.be/Vm9Z6mm2kcU?t=1856 . the idea was to only have 1 component with state object instead of 3

//made this class at https://youtu.be/Vm9Z6mm2kcU?t=1779
const OrderPreview = (props) => {

    const { data } = props;
    return(
      <div>
        <React.Fragment>
          {
              data &&
              //fill out this item group around https://youtu.be/Vm9Z6mm2kcU?t=577
              <React.Fragment>

                <Item.Group relaxed>
                  {/*loops through the items in the cart and displays them 1 by 1*/}
                  {data.order_items.map((orderItem, i) => {
                    return (
                      <Item key={i}>
                        <Item.Image
                          size='tiny'
                          src={`http://127.0.0.1:8000${orderItem.item.image}`}
                        />

                        <Item.Content verticalAlign='middle'>
                          <Item.Header as='a'>
                            {orderItem.quantity} x {orderItem.item.title}
                          </Item.Header>
                          <Item.Extra>
                            <Label>${orderItem.final_price}</Label>
                          </Item.Extra>
                        </Item.Content>

                      </Item>
                    );
                  })}
                </Item.Group>


                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Item.Header>
                        Order Total: ${data.total}
                        {
                          data.coupon &&
                          <Label color="green" style= {{marginLeft:'10px'}}>
                            Current coupon: {data.coupon.code} for ${data.coupon.amount}
                          </Label>
                        }
                      </Item.Header>
                    </Item.Content>
                  </Item>
                </Item.Group>

            </React.Fragment>
            }
        </React.Fragment>
      </div>
  )
}





//made at https://youtu.be/Vm9Z6mm2kcU?t=1187
class CouponForm extends Component {
  state = {
    code: ''
  };

  //made at https://youtu.be/Vm9Z6mm2kcU?t=1431
  handleChange = e => {
    this.setState({
      code: e.target.value
    });
  };

  //for adding a coupon
  handleAddCoupon = (e, code) => {
    e.preventDefault();
    this.setState({ loading: true });

    authAxios.post(addCouponURL, {code})
    .then(res => {
      this.setState({ loading: false });
      this.handleFetchOrder();
    })
    .catch(err => {
      this.setState({ error: err, loading: false });
    });
  };

  //handleAddCoupon comes from the Checkout form component.. gets passed in
  handleSubmit = (e) => {
    const { code } = this.state;
    this.handleAddCoupon(e, code);
    //resets the form with the code.. without this, the code stays in the textbox after page refresh
    this.setState({code: ''});
  };

  render(){
    const {code} = this.state;

    return(
      <React.Fragment>
          <Input
            fluid
            icon='angle right'
            placeholder='Enter a coupon...'
            value={code}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
      </React.Fragment>

    )
  }
}


class AddressForm extends Component {
  state = {
    shippingAddresses: [],
    selectedShippingAddress: '',
  }

  componentDidMount(){
    this.setState({
      shippingAddresses: this.handleFetchShippingAddresses(),
      selectedShippingAddress: this.handleGetDefaultAddress()
    })
  }

  //created at https://youtu.be/NaJ-b0ZaSoI?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=209
  handleFetchShippingAddresses = () => {
    this.setState({loading: true});
    authAxios
      //S for shipping
      .get(addressListURL)
      .then(res => {
        //dispatches the cartSuccess method with data
        this.setState({
          shippingAddresses: res.data.map(a => {
            return {
              key: a.id,
              text: `${a.street_address}, ${a.country}`,
              value: a.id
              };
            }),
          selectedShippingAddress: this.handleGetDefaultAddress(res.data) ,
          loading: false
        });
      })
      .catch(err => {
          this.setState( {error: err, loading: false} );
      });
  }

  //made at https://youtu.be/NaJ-b0ZaSoI?t=875
  handleGetDefaultAddress = (addresses) => {
    const filteredAddresses = addresses.filter( el => el.default === true )
    if(filteredAddresses.length > 0){
      return filteredAddresses[0].id;
    }
    return '';
  }



  render(){

    return(
        <React.Fragment>


  


          {
          /*
          <Header>Select a shipping address [{this.state.shippingAddresses.length}]</Header>
          {
            //checks if there are no billing addresses and suggests a redirection
            this.state.shippingAddresses.length > 0 ?
            //changed name to value at https://youtu.be/NaJ-b0ZaSoI?t=1160 so that you can reselect an address
            <Select
              name='selectedShippingAddress'
              value={this.state.selectedShippingAddress}
              clearable
              options={this.state.shippingAddresses}
              selection
              onChange={this.handleSelectChange}
              /> :
              <p>
                You nede 2 <Link to='/profile'>add an shipring ardreses</Link> plz
              </p>
          }
          <Divider />
          */}
        </React.Fragment>
    )
  }
}








class CheckoutForm extends Component {

  state = {
    data: null,
    loading: false,
    error: null,
    success: false,

  }

  componentDidMount(){
    //gets the order when the component has mounted
    this.handleFetchOrder();
    console.log('data compdidmount' ,this.state.data)
  }



  //comes from OrderSummary.js
  handleFetchOrder = () => {
    this.setState({loading: true});
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        //dispatches the cartSuccess method with data
        this.setState( {data: res.data, loading: false} );
        console.log("data: fetchorder" , this.state.data);
      })
      .catch(err => {
        //made this around https://youtu.be/Vm9Z6mm2kcU?t=207
        //this is what gets triggered if there is no current order
        if(err.response.status === 404){
          //made at https://youtu.be/NaJ-b0ZaSoI?t=1620
          //moves the user to /products if they don't have an active order.
          this.props.history.push('/products');
        } else{
          this.setState( {error: err, loading: false} );
        }

      });
  };



  //made at https://youtu.be/NaJ-b0ZaSoI?t=1035
  //for letting the user select more than just the default shipping address
  handleSelectChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    });
  };


  //filled out this at https://youtu.be/z7Kq6bHxEcI?t=566
  //for submitting the payment
  submit = (ev) => {
      ev.preventDefault();
      console.log("SUBMIT FUNCTION");
    }

  render() {
    const {
        data,
        error,
        loading,
        success,
        shippingAddresses,
        selectedShippingAddress,

      } = this.state;

    console.log('data ', data);
    console.log(data);

    return (
      <React.Fragment>
        <div>
          {
            //if there's an error then display a message component
            error &&
            (
              <Message
                error
                header='There was some errors with your submission'
                content={ JSON.stringify(error) }
              />
            )
          }
          {
            //if loading is true then render the spinner component
            loading
            &&
            (
            <Segment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
            </Segment>
            )
          }
          {
            success && (
            <Message positive>
              <Message.Header>Your order has been placed!</Message.Header>
              <p>
                You will receive an email shortly with your order details
              </p>
            </Message>
            )
          }
        </div>

        {/*grid to hold the checkout info*/}
        <Grid>
          <Grid.Row>

            {/*grid to hold the breadcrumbs for checkout info*/}
            <Grid.Column width={12}>
              <Breadcrumb>
                <Breadcrumb.Section link>Information</Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section link>Shipping</Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section active>Order Review</Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section link>Payment</Breadcrumb.Section>

              </Breadcrumb>
            </Grid.Column>

            <Divider />

            {/*grid for holding the price info*/}
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header>Price: </Card.Header>
                    <Card.Description>
                      subtotal: _______
                    </Card.Description>
                    <Card.Description>
                      tax: ______
                    </Card.Description>
                    <Card.Description>
                      shipping: _______
                    </Card.Description>
                    <Card.Description>
                      Total: ______
                    </Card.Description>

                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header>Coupon</Card.Header>
                  <CouponForm />
                </Card.Content>
              </Card>
            </Grid.Column>

          </Grid.Row>

        </Grid>
      </React.Fragment>


    );
  }
}


//const InjectedForm = withRouter(injectStripe(CheckoutForm));


const WrappedForm = () => (
  <Container text>
      <h1>Complete your order</h1>
      <CheckoutForm />

  </Container>

)

export default WrappedForm;


/*
1. adding the order items in the payment view as a summary
2. adding discount code form in checkout view
*/
