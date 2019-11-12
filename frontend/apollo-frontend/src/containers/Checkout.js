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

//import ShippingForm from './ShippingForm';

import {authAxios} from '../utils';

import {
    checkoutURL,
    orderSummaryURL,
    addCouponURL,
    addressListURL,
    countryListURL,

  } from '../constants';

/*
should display the checkout process through the breadcrumbs.
planning on making each part of the breadcrumbs it's own component


*/




//made this file at https://youtu.be/z7Kq6bHxEcI?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=426
//made major restructuring to this file around https://youtu.be/Vm9Z6mm2kcU?t=1856 . the idea was to only have 1 component with state object instead of 3

class OrderReview extends Component {

  render(){
    return(
      <React.Fragment>
        <Header>Order review</Header>
        <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header>iPhone 4s 16gb </Card.Header>
              <Card.Meta>$99.99</Card.Meta>
              <Card.Description>
                this is a brick lmao
              </Card.Description>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>Family pack of Goldfish snack crackers</Card.Header>
              <Card.Meta>$9.99</Card.Meta>
              <Card.Description>
                This is a pack of goldfish crackers that is designed to be able to feed an entire family
              </Card.Description>
            </Card.Content>

          </Card>

          <Card>
            <Card.Content>
              <Card.Header>A refridgerator</Card.Header>
              <Card.Meta>$299.99</Card.Meta>
              <Card.Description>
                this will keep your snacks cold
              </Card.Description>
            </Card.Content>

          </Card>

        </Card.Group>
      </React.Fragment>

    )
  }

}




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






//made at https://youtu.be/Vm9Z6mm2kcU?t=1187
class CouponForm extends Component {
  state = {
    code: ''
  };



  //made at https://youtu.be/Vm9Z6mm2kcU?t=1431
  handleChange = (e) => {
    this.setState({
      code: e.target.value
    });

  };

  //for adding a coupon
  handleAddCoupon = (e, code) => {
    console.log("HELLO?????")
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

    console.log("handleaddcoupon : " , this.state.data)

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












{/* FOR FORM VALIDATION: https://mdbootstrap.com/docs/react/forms/validation/*/}
class AddressForm extends Component {
  state = {
    shippingAddresses: [],
    selectedShippingAddress: '',
    loading: false,
    countries: [],
    formData: [],

  }

  componentDidMount(){
    this.setState({
      shippingAddresses: this.handleFetchShippingAddresses(),
      //selectedShippingAddress: this.handleGetDefaultAddress()
      countries: this.handleFetchCountries(),

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

  //made at https://youtu.be/c54wYYIXZ-A?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=1763
  handleFormatCountries = (countries) => {
    //want to get all the object keys of the countrioes object
    const keys = Object.keys(countries);
    //makes a new multidimensional, associative array of countries
    //"for every country, return it's key (read: country code), text (read: name), and value (read: country code)"

    //console.log('KEYS: ', keys)
    return keys.map(k => {
      return{
        key: k,
        text: countries[k],
        value: k
      }
    })
  }

  handleFetchCountries = () => {
    authAxios
    .get(countryListURL)
    .then(res => {

      //console.log(this.handleFormatCountries(res.data))
      this.setState({ countries: this.handleFormatCountries(res.data) });


      //console.log('countries.length: ', this.state.countries.length);
    })
    .catch(err => {
      this.setState({ error: err });
    })
  }

  //made at https://youtu.be/NaJ-b0ZaSoI?t=875
  // handleGetDefaultAddress = (addresses) => {
  //   const filteredAddresses = addresses.filter( el => el.default === true )
  //   if(filteredAddresses.length > 0){
  //     return filteredAddresses[0].id;
  //   }
  //   return '';
  // }

  handleSelectChange = (e, {name, value} ) => {
    const {formData} = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({
      formData: updatedFormData
    })
    console.log("form data", this.state.formData)
  }



  render(){

    const {
      shippingAddresses,
      selectedShippingAddress,
      loading,
      countries,
      formData,

    } = this.state;


    return(

        <React.Fragment>
          <Header>Enter your name and shipping address</Header>
          <Form loading={loading}>

            <Form.Group>
              <Form.Field required width={8}>
                <label>Name</label>
                <input placeholder='Full Name' />
              </Form.Field>

              <Form.Field required width={8}>
                <label>Email</label>
                <input placeholder='Email' />
              </Form.Field>
            </Form.Group>

            <Form.Field required>
              <label>Address</label>
              <input placeholder='Address' />
            </Form.Field>

            <Form.Group>

              <Form.Field required width={4}>
                <label>City</label>
                <input placeholder='City' />
              </Form.Field>

              <Form.Field required width={3}>
                <label>State</label>
                <input placeholder='State' />
              </Form.Field>

              <Form.Field required width={3}>
                <label>Zip Code</label>
                <input placeholder='Zip' />
              </Form.Field>

              <Form.Field required width={7}>
                <label>Country</label>
                <Select
                  loading={loading}
                  fluid
                  clearable
                  search
                  options={ countries }
                  name='country'
                  placeholder='Country'
                  onChange={this.handleSelectChange}
                  value={formData.country}
                />
              </Form.Field>

            </Form.Group>


          </Form>

        </React.Fragment>
    )
  }
}




class CheckoutBreadCrumbs extends React.Component {

  state= {
    activeCrumb: '',
    information: true,
    shipping  : false,
    orderReview : false,
    payment : false,
  };


  handleBreadcrumbClick = (e, data) =>{
    //console.log('BC CLICK: ', data)
    //switch that changes which breadcrumb title is selected when clicking on it
    switch(data.id){
      case 'info':
        this.setState({
          information : true,
          shipping  : false,
          orderReview : false,
          payment : false,
        })
        console.log('info: ', this.state)
      break;

      case 'ship':
        this.setState({
          information : false,
          shipping  : true,
          orderReview : false,
          payment : false,
        })
        console.log('ship: ', this.state)
      break;
      //should never be the case (changed the layout to display the order review on the righthand side)
      case 'review':
        this.setState({
          information : false,
          shipping  : false,
          orderReview : true,
          payment : false,
        })
        console.log('review: ', this.state)
      break;

      case 'payment':
        this.setState({
          information : false,
          shipping  : false,
          orderReview : false,
          payment : true,
        })
        console.log('payment: ', this.state)
      break;

      default:
        console.log("something went wrong in the switch case for breadcrumb clicks")
    }
  }



  renderForm = () => {
    const {
      information,
      shipping,
      orderReview,
      payment,
    } = this.state;


    if( information){
      return(
        <AddressForm />
      )
    }else if(shipping){
      return(
        <ShippingForm />
      )
    //should not be the case ever bc ui design changes
    }else if(orderReview){
      return(
        <OrderReview />
      )
    }else if(payment){
      return(
        <PaymentForm />
      )
    }
  }



  render(){

    return(
      <React.Fragment>
      <Breadcrumb>
        <Breadcrumb.Section
          id='info'
          active={this.state.information}
          as='div'
          style={{cursor: 'pointer'}}
          onClick={(e, data) => { this.handleBreadcrumbClick(e, data) } }
        >
          Information
        </Breadcrumb.Section>

        <Breadcrumb.Divider />
        <Breadcrumb.Section
          id='ship'
          active={this.state.shipping}
          as='div'
          style={{cursor: 'pointer'}}
          onClick={(e, data) => { this.handleBreadcrumbClick(e, data) } }>
          Shipping
        </Breadcrumb.Section>

        <Breadcrumb.Divider />
        {/*
        <Breadcrumb.Section
          id='review'
          active={this.state.orderReview}
          as='div'
          style={{cursor: 'pointer'}}
          onClick={(e, data) => { this.handleBreadcrumbClick(e, data) } }
          >
          Order Review
        </Breadcrumb.Section>

        <Breadcrumb.Divider />
        */}
        <Breadcrumb.Section
          id='payment'
          active={this.state.payment}
          as='div'
          style={{cursor: 'pointer'}}
          onClick={(e, data) => { this.handleBreadcrumbClick(e, data) } }
          >
          Payment
        </Breadcrumb.Section>

      </Breadcrumb>

      {this.renderForm()}
    </React.Fragment>

    )
  }

}











class CheckoutForm extends React.Component {

  state = {
    data: null,
    loading: false,
    error: null,
    success: false,
    total: null
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
        this.setState( {data: res.data, total: res.data.total , loading: false} );

        console.log("data: fetchorder" , this.state.data.total);
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
        total,

      } = this.state;

    console.log('data inside render(): ', data);
    console.log('data.total: ', data);

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


        {
          //if loading is true then render the spinner component
          loading
          ?
          (
          <Segment>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
          </Segment>
          ) : (

            <React.Fragment>
              {/*grid to hold the checkout info*/}
              <Grid>

                <Grid.Row>
                  {/*literally just to display "complete your order" abve the breadcrumbs and total.... probably a better way to do this*/}
                  <Grid.Column width={3}>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <h1>Complete your order</h1>
                    <Divider/>
                  </Grid.Column>
                  <Grid.Column width={4}>
                  </Grid.Column>
                </Grid.Row>


                <Grid.Row>
                    {/*empty filler column to help with spacing of the rest of the page, probably can do this with some type of offset, not sure though*/}
                  <Grid.Column width={3}>
                  </Grid.Column>

                  {/*column to hold the breadcrumbs for checkout info*/}
                  <Grid.Column width={9}>
                    <CheckoutBreadCrumbs />

                  </Grid.Column>
                  {/*for some reason this divider doesn't want to work lol*/}
                  <Divider vertical />


                  {/*column for holding the price info*/}
                  <Grid.Column width={4}>

                    <Header>Order Review</Header>
                    <Card.Group>
                      <Card>
                        {
                          data &&
                          data.order_items.map(item => {
                            console.log('item id: ', item.item.id)
                            return (
                              <Card.Content>
                                <Card.Header>
                                  {item.item.title} [{item.quantity}]
                                </Card.Header>
                                <Card.Meta >Total: ${item.item.price * item.quantity}</Card.Meta>
                              </Card.Content>
                            )
                          })
                        }
                      <Card.Content>
                        <Card.Header>Price: </Card.Header>
                          <Card.Description>
                            subtotal: ${total}
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
                      </Card.Group>

                      <Card>
                        <Card.Content>
                          <Card.Header>Coupon</Card.Header>
                          {   data &&
                              data.coupon !== null ?
                                <Label color='green'><Icon name='check circle' color='grey'/> applied code "{data.coupon.code}" worth ${data.coupon.amount}</Label> :
                                null
                          }
                          <CouponForm />
                        </Card.Content>
                      </Card>

                  </Grid.Column>

                </Grid.Row>

              </Grid>

            </React.Fragment>

          )
        }
      </React.Fragment>


    );
  }
}


//const InjectedForm = withRouter(injectStripe(CheckoutForm));


const WrappedForm = () => (
      <CheckoutForm />
)

export default WrappedForm;


/*
1. adding the order items in the payment view as a summary
2. adding discount code form in checkout view
*/
