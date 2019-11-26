import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DECREASE_QUANTITY

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
  //if there are items in the order then determine if the current "added item" is already in the array, if it isn't, add it. if it is, increase the quantity of the item already in the array
  //if there are no items in the order (ie, cart = 0) then just add the item to the order_items array
  let containsItem = false
  let itemIndex = 0
  let cart = state.shoppingCart
  let cartTotal = 0
  //loop through every item that is in the cart now and check if it is the item that is being added to the cart
  //doing this so that if the item is already there, the quantity will just be increased instead of adding a redundant item
  for(itemIndex ; itemIndex < cart.order_items.length ; itemIndex++ ){
    if( cart.order_items[itemIndex].item.id == action.data.item.id ){
      containsItem = true;
      break;
    }
  }
  //if it contains the item, increase the quantity of the item that is already in the array if it doesn't, add it to the array
  if(containsItem){
    cart.order_items[itemIndex].quantity += action.data.quantity
    cart.order_items[itemIndex].final_price += (action.data.quantity * (action.data.item.discount_price !== null ? action.data.item.discount_price : action.data.item.price) )
  }else {
    cart.order_items = cart.order_items.concat(action.data)
  }

  //loops through the order_items and determines what the new total of the  cart is, and assigns that value to cart.total
  cart.order_items.map( item => {
    cartTotal += item.final_price
  })
  cart.total = Number(cartTotal.toFixed(2))

  return updateObject(state, {
    shoppingCart: cart,
    error: null,
    loading: false
  });
}





const removeFromCart = (state, action) => {
  let cart = state.shoppingCart

  //loops through the cart and subtracts that item's final_price, then removes the item if it is equal to the given itemID
  for( let itemIndex=0 ; itemIndex < cart.order_items.length ; itemIndex++ ){
    if( cart.order_items[itemIndex].item.id === action.data ){
      cart.total -=  Number(cart.order_items[itemIndex].final_price.toFixed(2))
      cart.order_items.splice(itemIndex, 1)
      break;
    }
  }

  //sets the cart in the local storage.
  //if the new cart isn't set in local storage, the cart isn't updated on page refresh (the item will reappear on the screen)
  ls.set('cart', cart)

  return updateObject(state, {
    shoppingCart: cart,
    error: null,
    loading: false
  });
}




const decreaseQuantity = (state, action) => {
  console.log('action from decreaseQuantity: ', action)
  let cart = state.shoppingCart
  let cartTotal = 0

  //loops through the cart and decreases the quantity of the given item, and updates the final_price of the item
  for( let itemIndex=0 ; itemIndex < cart.order_items.length ; itemIndex++ ){
    if( cart.order_items[itemIndex].item.id === action.data ){
      let item_price = (
          cart.order_items[itemIndex].item.discount_price !== null ?
          cart.order_items[itemIndex].item.discount_price :
          cart.order_items[itemIndex].item.price
        )
      cart.order_items[itemIndex].quantity -= 1
      cart.order_items[itemIndex].final_price = (cart.order_items[itemIndex].quantity) * item_price
      break;
    }
  }
  //loops through the order_items and determines what the new total of the  cart is, and assigns that value to cart.total
  cart.order_items.map( item => {
    cartTotal += item.final_price
  })
  cart.total = Number(cartTotal.toFixed(2))

  return updateObject(state, {
    shoppingCart: cart,
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
    case DECREASE_QUANTITY:
      return decreaseQuantity(state, action);
    default:
      return state;
  }
};

export default reducer;
