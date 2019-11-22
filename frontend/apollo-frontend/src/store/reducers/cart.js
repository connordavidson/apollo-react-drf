import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART
} from "../actions/actionTypes";
import { updateObject } from "../utility";
import ls from 'local-storage';



const initialState = {
  //assigns shoppingCart to 'cart' in the local storage,
  //  or assigns it to the basic outline that the DB is expecting (if they have never been to the site before )
  shoppingCart: ls.get('cart') ||
    {
      'coupon' : {},
      'id' : 0,
      'order_items' : [],
      'total': 0
    },

  error: null,
  loading: false
}



const cartStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};



const cartSuccess = (state, action) => {
  return updateObject(state, {
    shoppingCart: action.data,
    error: null,
    loading: false
  });

  console.log('cartsuccess shoppingCart: ', this.state.shoppingCart)
};


const addToCart = (state, action) => {
  // console.log('addToCart reducer with action.data: ', action.data)
  //
  // console.log('state from ADDTOCART reducers : ', state)

  state.shoppingCart.order_items = state.shoppingCart.order_items.concat(action.data)


  // console.log('state.shoppingCart from ADDTOCART reducers : ', state.shoppingCart)

  return updateObject(state, {
    shoppingCart: state.shoppingCart,
    error: null,
    loading: false
  });



}



const cartFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};



const reducer = (state = initialState, action) => {
  switch (action.type) {

    case CART_START:
      return cartStart(state, action);
    case CART_SUCCESS:
      return cartSuccess(state, action);
    case CART_FAIL:
      return cartFail(state, action);
    case ADD_TO_CART:
      return addToCart(state, action);
    default:
      return state;
  }
};

export default reducer;
