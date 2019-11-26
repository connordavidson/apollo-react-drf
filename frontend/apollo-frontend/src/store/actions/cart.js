import axios from "axios";
import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,

}
from "./actionTypes";

import {authAxios} from '../../utils';
import {
  orderSummaryURL,
  productDetailURL,

} from '../../constants';



export const cartStart = () => {
  return {
    type: CART_START,
  };
};


export const cartSuccess = data => {
  //console.log('CART: ', data);
  return {
    type: CART_SUCCESS,
    data
  };
};


export const addToCart = (data ) => {
  //console.log('addTOCart ACTIONS data: ', data)
  return {
    type: ADD_TO_CART,
    data,
  }
}

export const removeFromCart = (data ) => {
  //console.log('addTOCart ACTIONS data: ', data)
  return {
    type: REMOVE_FROM_CART,
    data,
  }
}



export const cartFail = error => {
  return {
    type: CART_FAIL,
    error: error
  };
};


//what we call when the app is loaded. fetches whatever is in the cart at load and can be called again to update the display with the contents of the cart
export const fetchCart = () => {
  return dispatch => {
    dispatch(cartStart());
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        //dispatches the cartSuccess method with the response data
        dispatch( cartSuccess(res.data) );
      })
      .catch(err => {
        dispatch( cartFail(err) );
      });
  };
};



export const removeItemFromCart = (data) => {
  return dispatch => {
    //for some reason, the navigation bar doesn't update when this line gets removed
    dispatch(cartStart())

    dispatch(removeFromCart(data))
  }
}




export const addItemToCart = (data, quantity, variations) => {

  //this reformats the data and the quantity to be in the format that the backend is expecting it (for when it gets saved int othe DB)
  //the same format as a order_item in the cart
  let newOrderItem = {
    'final_price' : (data.discount_price ? quantity*data.discount_price : quantity*data.price),
    'id'          : 0,
    'item'        : {
      'category'        : data.category ,
      'description'     : data.description ,
      'discount_price'  : data.discount_price ,
      'id'              : data.id ,
      'image'           : data.image ,
      'label'           : data.label ,
      'price'           : data.price ,
      'slug'            : data.slug ,
      'title'           : data.title
    },
    'item_variations' : variations ,
    'quantity' : Number(quantity)
  }

  console.log('newOrderItem from cart actions: ', )
  return dispatch => {
    dispatch(cartStart());
    dispatch( addToCart(newOrderItem) )
  }

};
