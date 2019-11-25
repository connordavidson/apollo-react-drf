import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,

} from "../actions/actionTypes";
import { updateObject } from "../utility";
import ls from 'local-storage';



const initialState = {
  //assigns shoppingCart to 'cart' in the local storage,
  //  or assigns it to the basic outline that the DB is expecting (if they have never been to the site before )
  shoppingCart: ls.get('cart') ||
    {
      'coupon' : null,
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
  // console.log('state from ADDTOCART reducers : ', state)
  // console.log('cart.js action.data' , action.data)


  //if there are items in the order then determine if the current "added item" is already in the array, if it isn't, add it. if it is, increase the quantity of the item already in the array
  //if there are no items in the order (ie, cart = 0) then just add the item to the order_items array
  let containsItem = false
  let itemIndex = 0
  let cart = state.shoppingCart
  let cartTotal = 0.0

  //loop through every item that is in the cart now and check if it is the item that is being added to the cart
  //doing this so that if the item is already there, the quantity will just be increased instead of adding a redundant item
  for(itemIndex ; itemIndex < cart.order_items.length ; itemIndex++ ){
    if( cart.order_items[itemIndex].item.id == action.data.item.id ){
      containsItem = true;
      break;
    }
  }
  // console.log('containsItem: ', containsItem)
  // console.log('itemIndex: ', itemIndex)

  //if it contains the item, increase the quantity of the item that is already in the array if it doesn't, add it to the array
  if(containsItem){
    cart.order_items[itemIndex].quantity += action.data.quantity
    cart.order_items[itemIndex].final_price += (action.data.quantity * (action.data.item.discount_price !== null ? action.data.item.discount_price : action.data.item.price) )
  }else {
    cart.order_items = cart.order_items.concat(action.data)

  }
  //console.log('orderItems: ' , orderItems)
  cart.order_items.map( item => {
    cart.total += item.final_price
  })
  //console.log('cartTotal: ', cartTotal)



  return updateObject(state, {
    shoppingCart: state.shoppingCart,
    error: null,
    loading: false
  });
}







const removeFromCart = (state, action) => {

  //need to figure out how to "un-concat"
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
    case REMOVE_FROM_CART:
      return removeFromCart(state, action);
    default:
      return state;
  }
};

export default reducer;
