

import React, {Component} from 'react';
import {
  Form,

  } from 'semantic-ui-react';

import {authAxios} from '../../utils';


import {
  addCouponURL,

  } from '../../constants';


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

    //console.log('COUPON CODE FROM HANDLECHANGE : ', e.target.value)
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

    console.log("handleaddcoupon this.state.data: " , this.state.data)

  };



  render(){
    const {code} = this.state;
    return(
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            fluid
            icon='angle right'
            placeholder='Enter a coupon...'
            value={code}
            onChange={this.handleChange}
            //onKeyPress={this.handleSubmit}
          />
        </Form>
      </React.Fragment>
    )
  }
}


export default CouponForm
