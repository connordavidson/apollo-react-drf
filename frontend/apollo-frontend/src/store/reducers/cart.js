import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DECREASE_QUANTITY,
  MERGE_CART,
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
  loading: false,
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


const cartFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
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

  // //logic for adding the item into the database if the user is logged in
  // if(ls.get('token') !== null){
  //   authAxios
  //     .post( addToCartURL , {slug}  )
  //     .then(res => {
  //       // console.log(res.data, addToCartURL, "add to cart succeeded");
  //       this.props.fetchCart();
  //       this.setState({ loading: false });
  //     })
  //     .catch(err => {
  //       this.setState({ error: err, loading: false });
  //       // console.log(err , 'add-to-cart failed ');
  //     });
  // }

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



//is used to decrease quantity in the little +/- thing in the dropdown and on order-summary page
const decreaseQuantity = (state, action) => {
  // console.log('action from decreaseQuantity: ', action)
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


//this is used when the user logs in.. it merges the two cart objects and updates quantities and prices
//the two carts are stateCart and savedCart.
//stateCart is the cart that is already saved in the state when the user logged in. this may be a "blank template" of the cart, or it may contain items that the user added to their cart before they logged in
//savedCart is a cart that gets pulled from the database when the user logs in. this should contain items.
const mergeCart = (state, action) => {

  console.log("action.data MERGECART: " , action.data)


  //if there are items in the order then determine if the current "added item" is already in the array, if it isn't, add it. if it is, increase the quantity of the item already in the array
  //if there are no items in the order (ie, cart = 0) then just add the item to the order_items array
  let containsItem = false
  let stateCartItemIndex = 0
  let savedCartItemIndex = 0
  let stateCart = state.shoppingCart
  let savedCart = action.data
  let cartTotal = 0
  let final_price = 0

  //if there is something in the cart already, merge them
  if(stateCart.order_items.length > 0){
    //for every item in the user's saved cart (from the DB), loop through all of the items in the "State Cart" and check if the two items are the same item (using item.id)
    //if they are equal, increase the quantity and order_item final_price of the "state item" with the item from the saved cart.
    for(savedCartItemIndex ; savedCartItemIndex < savedCart.order_items.length ; savedCartItemIndex++ ){
      //creates a label (titled stateCart) for this loop. this is used for breaking out of just this loop. without the label, the break statement breaks out of both loops
      stateCart:
      //this loop is used to loop through the current cart saved in the state and to find out if the saved Cart item is already in the state.
      for(stateCartItemIndex ; stateCartItemIndex < stateCart.order_items.length; stateCartItemIndex++){
        //without this being set to false, it will only += the quantity of the first alike item, and will just repeatedly add the other items from the DB cart to the state cart
        containsItem = false
        if( stateCart.order_items[stateCartItemIndex].item.id == savedCart.order_items[savedCartItemIndex].item.id ){
          containsItem = true;
          break stateCart;
        }
      }
      //if it contains the item, increase the quantity of the item that is already in the array if it doesn't, add it to the array
      if(containsItem){
        //if the quantity of the item in the State Cart is less than the quantity of the item from the Saved Cart, then set the Quantity of the State cart to the quantity of the Saved Cart
        //if the quantity is greater, then don't do anything. bc they obviously want more than they previously had put into their cart
        if(stateCart.order_items[stateCartItemIndex].quantity < savedCart.order_items[savedCartItemIndex].quantity){
          stateCart.order_items[stateCartItemIndex].quantity = savedCart.order_items[savedCartItemIndex].quantity
          //calculates new final price of the item (based on the new quantity). uses the new quantity and determines if the item has a discount_price or not and then uses it
          final_price += (stateCart.order_items[stateCartItemIndex].quantity * (stateCart.order_items[stateCartItemIndex].item.discount_price !== null ? stateCart.order_items[stateCartItemIndex].item.discount_price : stateCart.order_items[stateCartItemIndex].item.price) )
          stateCart.order_items[stateCartItemIndex].final_price = final_price
        }
      }else {
        //if the cart in the state does not contain the item from the saved Cart, then add it to the end of the state cart
        stateCart.order_items = stateCart.order_items.concat( savedCart.order_items[savedCartItemIndex] )
      }
    }
  } else {
    //if there is nothing in the cart already, the new cart is all of the information that was stored in the database
    stateCart = savedCart
  }


  //loops through the order_items and determines what the new total of the  cart is, and assigns that value to cart.total
  stateCart.order_items.map( item => {
    cartTotal += item.final_price
  })
  stateCart.total = Number(cartTotal.toFixed(2))


  ls.set('cart', stateCart)

  return updateObject(state, {
    shoppingCart: stateCart,
    error: null,
    loading: false
  });


  // //loop through every item that is in the cart now and check if it is the item that is being added to the cart
  // //doing this so that if the item is already there, the quantity will just be increased instead of adding a redundant item
  // for(itemIndex ; itemIndex < cart.order_items.length ; itemIndex++ ){
  //   if( cart.order_items[itemIndex].item.id == action.data.item.id ){
  //     containsItem = true;
  //     break;
  //   }
  // }
  // //if it contains the item, increase the quantity of the item that is already in the array if it doesn't, add it to the array
  // if(containsItem){
  //   cart.order_items[itemIndex].quantity += action.data.quantity
  //   cart.order_items[itemIndex].final_price += (action.data.quantity * (action.data.item.discount_price !== null ? action.data.item.discount_price : action.data.item.price) )
  // }else {
  //   cart.order_items = cart.order_items.concat(action.data)
  // }
  //
  // //loops through the order_items and determines what the new total of the  cart is, and assigns that value to cart.total
  // cart.order_items.map( item => {
  //   cartTotal += item.final_price
  // })
  // cart.total = Number(cartTotal.toFixed(2))
  //
  // return updateObject(state, {
  //   shoppingCart: cart,
  //   error: null,
  //   loading: false
  // });
  //

}






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
    case MERGE_CART:
      return mergeCart(state, action);
    default:
      return state;
  }
};

export default reducer;
