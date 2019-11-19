import React, {Component} from 'react';

import {
    Message,
    Divider,
    Header,
    Loader,
    Segment,
    Dimmer,
    Icon,
    Label,
    Grid,
    Breadcrumb,
    Card,
    Container,

  } from 'semantic-ui-react';

import {
    Link,
    withRouter,

  } from 'react-router-dom';


import {authAxios} from '../../utils';

import {
    orderSummaryURL,
  } from '../../constants';


import AddressForm from './AddressForm';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import CouponForm from './CouponForm';

/*
the BreadCrumbs are used to display information in a way that doesn't overwhelm the customer.

**FOR ADDRESS -> SHIPPING BREADCRUMB**
  the breadcrumbs need to check that the address is valid before letting the user move to the next breadcrumb.
  this is done by storing shippingAddressValidated in the state of the breadcrumbs.
  addressValidatedError is stored in the state and is used to send back to the address component if there is an error with the address validation.
    this is used when the user clicks on the next breadcrumb before all the inputs are validated
  addressInformation is used to send the validated address information back into the addressForm component.
    this is then used in the event that the user goes back to the addressForm breadcrumb and tries to edit  their info. the information automatically repopulates



*/


class CheckoutBreadCrumbs extends React.Component {

  state= {
    information: true,
    shipping  : false,
    orderReview : false,
    payment : false,
    shippingAddressValidated : false,
    addressValidatedError : false,
    addressInformation: {},

  };


  //callback method to get props from AddressForm component and set them into the state of the breadCrumbs component
  //shippingAddressValidated should be a boolean, responds true if the form is all validated and false if it is not validated
  handleFormValidated = (isValidated, isError=false) => {
    this.setState({
      shippingAddressValidated: isValidated,
      //addressValidatedError: isError
    })
  }


  handleGetAddressInforation = (addressInformation) => {
    this.setState({
      addressInformation: addressInformation
    })
  }


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
          addressValidatedError: true,
        })
        console.log('info: ', this.state)
      break;

      case 'ship':
        if(this.state.shippingAddressValidated){
          this.setState({
            information : false,
            shipping  : true,
            orderReview : false,
            payment : false,
            addressValidatedError: false,
          })
        }else{
          this.setState({
            addressValidatedError: true,
          })
        }
        console.log('ship: ', this.state)
      break;

      case 'payment':
        if(this.state.shippingAddressValidated){
          this.setState({
            information : false,
            shipping  : false,
            orderReview : false,
            payment : true,
          })
        }else{
          this.setState({
            addressValidatedError: true
          })
        }

        console.log('payment: ', this.state)
      break;

      default:
        console.log("something went wrong in the switch case for breadcrumb clicks")
    }
  }


  //displays the correct component based on what breadcrumb is clicked
  renderForm = () => {
    const {
      information,
      shipping,
      orderReview,
      payment,
      shippingAddressValidated,
      addressValidatedError,
      addressInformation,

    } = this.state;

    // console.log('addressInformation FROM STATE IN BREADCRUMBS COMP: ', addressInformation)
    if(information){
      return(
        <AddressForm
          handleAddressFormValidated={this.handleFormValidated}
          validatedError={addressValidatedError}
          sendAddressInformation={this.handleGetAddressInforation}
          addressInformation = {addressInformation}
        />
      )
    }else if(shipping){
      return(
        <ShippingForm />
      )
    }else if(payment){
      return(
        <PaymentForm />
      )
    }
  }



  render(){

    console.log('address form validated? from breadcrumbs comp : ', this.state.shippingAddressValidated)
    console.log('address form validated error? from breadcrumbs comp : ', this.state.addressValidatedError)


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
    //console.log('data compdidmount' ,this.state.data)
  }



  //comes from OrderSummary.js
  handleFetchOrder = () => {
    this.setState({loading: true});
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        //dispatches the cartSuccess method with data
        this.setState( {data: res.data, total: res.data.total , loading: false} );

        //console.log("data: fetchorder" , this.state.data.total);
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

    // console.log('data inside render(): ', data);
    // console.log('data.total: ', data);

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


              <Container>
                <Header as='h1'>Complete your order</Header>
                <Divider />

                <Grid>

                    {/*column to hold the breadcrumbs for checkout info*/}
                    <Grid.Column width={12}>
                      <CheckoutBreadCrumbs />
                    </Grid.Column>
                    {/*for some reason this divider doesn't want to work lol*/}


                    {/*column for holding the price info*/}
                    <Grid.Column width={4}>

                      <Header>Order Review</Header>
                      <Card.Group>
                        <Card>
                          {
                            data &&
                            data.order_items.map(item => {
                              //console.log('item id: ', item.item.id)
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

                        </Card>

                        <Card>
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



                </Grid>
              </Container>
            </React.Fragment>

          )
        }
      </React.Fragment>


    );
  }
}



export default CheckoutForm;


/*
1. adding the order items in the payment view as a summary
2. adding discount code form in checkout view
*/
