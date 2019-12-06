import React from 'react';
import {connect} from 'react-redux';
import { withRouter} from 'react-router-dom';
import {
  Label,
  Icon,


} from 'semantic-ui-react';


import {
    addItemToCart,
    removeItemFromCart,
    decreaseItemQuantity,

  } from '../store/actions/cart';

class IncreaseDecreaseQuantity extends React.Component {

  handleAddToCart = (data, quantity) => {
    this.setState({ loading: true });
    this.props.addItemToCart(data, quantity)
    this.setState({loading: false});
  }

  handleRemoveQuantityFromCart = (itemID, quantity) => {
    this.setState({ loading: true });
    if(quantity > 1){
      this.props.decreaseItemQuantity(itemID)
    } else {
      console.log('remove item from cart')
      this.handleRemoveItem(itemID)
    }
    this.setState({ loading: false });
  }

  //made at https://youtu.be/8UEZsm4tCpY?t=150
  handleRemoveItem = (itemID) => {
    this.setState({loading : true})
    this.props.removeItemFromCart(itemID)
    this.setState({loading : false})
  }

  render(){

    const {
      //cart,
      item
    } = this.props



    return(
      <Label>
        <Icon
          name='minus'
          color='red'
          style={{cursor: 'pointer'}}
          onClick={ () =>
            this.handleRemoveQuantityFromCart(item.item.id, item.quantity)
          }
        />

        {item.quantity}

        <Label.Detail>
          <Icon
            name='plus'
            color='green'
            style={{cursor: 'pointer'}}
            onClick={ () =>
              this.handleAddToCart(
                item.item,
                1
              )}
          />
        </Label.Detail>
      </Label>
    )
  }

}




const mapStateToProps = (state) => {
  return {
    //isAuthenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (data, quantity) => dispatch(addItemToCart(data, quantity)),
    removeItemFromCart: (itemID) => dispatch( removeItemFromCart(itemID) ),
    decreaseItemQuantity: (itemID) => dispatch( decreaseItemQuantity(itemID) ),

  };
};



export default
  withRouter (
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(IncreaseDecreaseQuantity)
  );
