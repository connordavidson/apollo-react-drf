import React, {Component} from 'react';
import {
    Message,
    Header,
    Form,
    Select,

  } from 'semantic-ui-react';

import {
    addressListURL,
    countryListURL,

  } from '../../constants';

import {authAxios} from '../../utils';


/*
this is used to display the shipping information form.

every time that the user clicks off of an input box, it triggers handleValidateInput to determine if the input is "valid"
  if the input is valid, it uses  handleCheckFormValidated to check if the rest of the form is valid.
  if all of the information is valid, it uses handleAddressFormValidated to tell the breadcrumbs that the information is valid and to let the user move to the next breadcrumbs.
the AddressForm component takes in addressInformation as props so that it can automatically populate the previously entered data.
  this is in case the user comes back to this form after going to other BreadCrumbs.


*/



/* FOR FORM VALIDATION: https://mdbootstrap.com/docs/react/forms/validation/*/
class AddressForm extends React.Component {
  state = {
    shippingAddresses: [],
    selectedShippingAddress: '',
    loading: false,
    countries: [],
    formData: [],
    nameError: false,
    emailError: false,
    addressError: false,
    cityError: false,
    stateError: false,
    zipError: false,
    
    nameValue: '',
    emailValue: '',
    addressValue: '',
    cityValue: '',
    stateValue: '',
    zipValue: '',

  }


  componentDidMount(){
    this.setState({
      shippingAddresses: this.handleFetchShippingAddresses(),
      //selectedShippingAddress: this.handleGetDefaultAddress()
      countries: this.handleFetchCountries(),
    })

    this.handlePopulateAddressInformation(this.props.addressInformation);
  }

  //callback function to send info to the parent component about if the form is validated (this is what will stop the user from clicking into the shipping breadcrumb before completing the address form)
  handleAddressFormValidated = (isValidated) => {
    this.props.handleAddressFormValidated(isValidated)
  }

  //callback function to send the address information to the parent component (breadcrumbs).
  //this is used so that it can send the data back to the component in the event that the user clicks back to the address breadcrumb.
  //this data will be used to repopulate the fields in the aforementioned event
  handleSendAddressInformation = (addressInformation) => {
    this.props.sendAddressInformation(addressInformation)
  }


  handlePopulateAddressInformation = (addressInformation) => {
    //console.log('POPULATE ADDRESSS INFORMATION ADDRESSINFO: ', addressInformation)
    if(addressInformation !== null) {
      this.setState({
        nameValue: this.props.addressInformation['name'] ,
        emailValue : this.props.addressInformation['email'],
        addressValue: this.props.addressInformation['address'],
        cityValue:  this.props.addressInformation['city'],
        stateValue: this.props.addressInformation['state'],
        zipValue:  this.props.addressInformation['zip'],
      })

      //console.log('ADDRESS INFO !== NULL: ', this.state)
    }else {
      console.log('address information === null: ', addressInformation)
    }
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



  //validates the form input, can create specific cases for form validation by using the error (becuase the error name is unique to each input box)
  //the error parameter is the name in the State of the error for that input (ie. nameError is the error for the name field)
  handleValidateInput = ( value, error) => {
    console.log('validating input with VALUE & ERROR: ', value, ' ', error)
    if(value === ''){
      this.setState({
        [error]: true,
      })
      //validates the zip value
    } else if(error === 'zipError' && value.length !== 5 ){
      this.setState({
        [error]: true,
      })
      //if the value for that input box is valid, check if the entire form is validated and set that input's error to be false
    } else {
      //checks if the form is fully validated
      this.handleCheckFormValidated()
      this.setState({
        [error]: false
      })
    }
  }



  //checks every form error and form value and makes sure that they are in the required position for the form to be "validated"
  //checks if the form is fully validated, if it is fully validated then it sends it to the parent component (the breadcrumbs component)
  handleCheckFormValidated = () => {
    if(
      this.state.nameError      === false &&
      this.state.emailError     === false &&
      this.state.addressError   === false &&
      this.state.cityError      === false &&
      this.state.stateError     === false &&
      this.state.zipError       === false &&

      this.state.nameValue      !== ''    &&
      this.state.emailValue     !== ''    &&
      this.state.addressValue   !== ''    &&
      this.state.cityValue      !== ''    &&
      this.state.stateValue     !== ''    &&
      this.state.zipValue       !== ''
    ) {
      //the form is validated and it sends 'true' to the parent component (the breadcrumbscomponent)
      this.handleAddressFormValidated(true)//, false)
      //the form is validated and it sends the form info to the parent component (the breadcrubms component)
      this.handleSendAddressInformation(
        {
          'name' : this.state.nameValue,
          'email': this.state.emailValue,
          'address': this.state.addressValue,
          'city' : this.state.cityValue ,
          'state': this.state.stateValue,
          'zip' : this.state.zipValue ,
        }
      )
    }else{
      this.handleAddressFormValidated(false)
    }
  }



  render(){
    //console.log('this.props from address form: ', this.props)


    const {
      shippingAddresses,
      selectedShippingAddress,
      loading,
      countries,
      formData,

      nameError,
      emailError,
      addressError,
      cityError,
      stateError,
      zipError,

      nameValue,
      emailValue,
      addressValue,
      cityValue,
      stateValue,
      zipValue,

    } = this.state;



    return(

        <React.Fragment>
          <Header>Enter your name and shipping address</Header>
          <Form loading={loading} error>

            <Form.Group>
              <Form.Field required width={8}>
                <label>Name</label>
                <Form.Input
                  value={nameValue}
                  error={nameError}
                  placeholder='Full Name'
                  onChange={
                    (e,data)=> {
                      this.setState({nameValue: data.value})
                    }
                  }
                  onBlur={
                    () => {
                      this.handleValidateInput( this.state.nameValue, 'nameError')
                    }
                  }
                />
              </Form.Field>

              <Form.Field required width={8}>
                <label>Email</label>
                <Form.Input
                  value={emailValue}
                  error={emailError}
                  placeholder='Email'
                  onChange={
                    (e, data) => {
                      this.setState({emailValue: data.value})
                    }
                  }
                  onBlur={
                    () => {
                      this.handleValidateInput(this.state.emailValue, 'emailError')
                    }
                  }
                />
              </Form.Field>
            </Form.Group>

            <Form.Field required>
              <label>Address</label>
              <Form.Input
                value={addressValue}
                error={addressError}
                placeholder='Address'
                onChange={
                  (e,data) => {
                    this.setState({addressValue: data.value})
                  }
                }
                onBlur={
                  () => {
                    this.handleValidateInput(this.state.addressValue, 'addressError')
                  }
                }
              />
            </Form.Field>

            <Form.Group>

              <Form.Field required width={4}>
                <label>City</label>
                <Form.Input
                  value={cityValue}
                  error={cityError}
                  placeholder='City'
                  onChange={
                    (e,data) => {
                      this.setState({cityValue: data.value})
                    }
                  }
                  onBlur={
                    () => {
                      this.handleValidateInput(this.state.cityValue, 'cityError')
                    }
                  }
                />
              </Form.Field>

              <Form.Field required width={3}>
                <label>State</label>
                <Form.Input
                  value={stateValue}
                  error={stateError}
                  placeholder='State'
                  onChange={
                    (e,data) => {
                      this.setState({stateValue: data.value})
                    }
                  }
                  onBlur={
                    () => {
                      this.handleValidateInput(this.state.stateValue, 'stateError')
                    }
                  }
                />
              </Form.Field>

              <Form.Field required width={3}>
                <label>Zip Code</label>
                <Form.Input
                  value={zipValue}
                  error={zipError}
                  placeholder='Zip Code'
                  onChange={
                    (e,data) => {
                      this.setState({zipValue: data.value})
                    }
                  }
                  onBlur={
                    () => {
                      this.handleValidateInput(this.state.zipValue, 'zipError')
                    }
                  }
                />
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

            {
              nameError || emailError || addressError || cityError || stateError || zipError ?
              <Message
                error
                header='Form incomplete'
                content='You need to fill out the highlighted input boxes'
              />
              :
              null
            }

            {
              this.props.validatedError &&
              <Message
                error
                header='Form incomplete'
                content='You need to complete the entire form before continuing to the next part of the checkout'
              />
            }

          </Form>
        </React.Fragment>
    )
  }
}



  export default AddressForm ;
