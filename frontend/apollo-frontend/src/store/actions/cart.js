import axios from "axios";
import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DECREASE_QUANTITY,
  MERGE_CART,
  REMOVE_CART,

}
from "./actionTypes";

import {authAxios} from '../../utils';
import {
  orderSummaryURL,
  productDetailURL,
  addToCartURL,

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


export const cartFail = error => {
  return {
    type: CART_FAIL,
    error: error
  };
};


export const addToCart = (data ) => {
  //console.log('addTOCart ACTIONS data: ', data)
  return {
    type: ADD_TO_CART,
    data,
  }
}

export const removeFromCart = (data) => {
  //console.log('addTOCart ACTIONS data: ', data)
  return {
    type: REMOVE_FROM_CART,
    data,
  }
}

export const decreaseQuantity = (data) => {
  return {
    type: DECREASE_QUANTITY,
    data,
  }
}

export const mergeCart = (data) => {
  return {
    type: MERGE_CART,
    data,
  }
}

export const removeCart = (data) => {
  console.log('DATA FROM ACTIONS/CART/REMOVECART: ', data)
  return {
    type: REMOVE_CART,
    data
  }
}





//what we call when the app is loaded. fetches whatever is in the cart at load and can be called again to update the display with the contents of the cart
export const mergeCartOnLogin = (token) => {
  return (dispatch) => {
    dispatch(cartStart());

    //this is basically just authAxios from utils.js...
    //when calling margeCartOnLogin() in authLogin, it wouldn't get the updated token from local storage so i had to change this so that it takes in the token as a parameter
    axios
      .create({
        baseURL: 'http://127.0.0.1:8000/api' ,
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .get(orderSummaryURL)
      .then(res => {
        //dispatches the cartSuccess method with the response data
        dispatch( mergeCart(res.data) );
      })
      .catch(err => {
        dispatch( cartFail(err) );
      });
  };
};



export const removeItemFromCart = (data) => {
  return dispatch => {
    //for some reason, the navigation bar doesn't update without dispatch(cartStart())
    dispatch(cartStart())
    dispatch(removeFromCart(data))
  }
}

export const decreaseItemQuantity = (data) => {

  return dispatch => {
    //for some reason, the navigation bar doesn't update without dispatch(cartStart())
    dispatch(cartStart())
    dispatch(decreaseQuantity(data))
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



export const removeCartOnLogout = (token) => {
  return (dispatch, getState) => {

    //getState gets the state from the Redux Store
    const stateCart = getState().cart.shoppingCart
    let savedCart = null
      // {
      //   'coupon' : null,
      //   'id' : 0,
      //   'order_items' : [],
      //   'total': 0
      // }
    let containsItem = false
    let stateCartItemIndex = 0
    let savedCartItemIndex = 0


    axios
      .create({
        baseURL: 'http://127.0.0.1:8000/api' ,
        headers: {
          Authorization: `Token ${token}`
        }
      })
    .get(orderSummaryURL)
    .then(response => {
      console.log('reponse.data from actions/cart/removeCartOnLogout : ', response.data)
      // dispatch(cartStart())
      savedCart = response.data
      console.log('savedCart: ', savedCart)
    })
    .catch(error => {
      console.log('error inside axios in actions/cart/removeCartOnLogout : ' , error )
    })

    setTimeout( () => {

      //there are items in the State Cart compare every item from the Saved Cart and the State Cart.
      //if the item is not already saved in the DB, insert it. if it is already in the db, ignore it
      if(stateCart.order_items.length > 0){

        for(stateCartItemIndex ; stateCartItemIndex < stateCart.order_items.length; stateCartItemIndex++){
          console.log('STATE CART ITEM ID: ', stateCart.order_items[stateCartItemIndex].item.id)
          //creates a label (titled stateCart) for this loop. this is used for breaking out of just this loop. without the label, the break statement breaks out of both loops
          savedCart:
          //this loop is used to loop through the current cart saved in the database and to find out if the state Cart item is already in the DB.
          for(savedCartItemIndex ; savedCartItemIndex < savedCart.order_items.length ; savedCartItemIndex++ ){
            console.log('SAVED CART ITEM ID: ', stateCart.order_items[stateCartItemIndex].item.id)
            //without this being set to false, it will only += the quantity of the first alike item, and will just repeatedly add the other items from the DB cart to the state cart
            containsItem = false
            if( stateCart.order_items[stateCartItemIndex].item.id === savedCart.order_items[savedCartItemIndex].item.id ){
              console.log('contains item: ', stateCart.order_items[stateCartItemIndex].item)
              containsItem = true;
              break savedCart;
            }
          }

          console.log('NEW STATE CART ITEM')
          //if the DB Cart doesn't contain the item from the state, insert it into the DB
          if(!containsItem){
            const slug = stateCart.order_items[stateCartItemIndex].item.slug
            axios
              .create({
                baseURL: 'http://127.0.0.1:8000/api' ,
                headers: {
                  Authorization: `Token ${token}`
                }
              })
              .post( addToCartURL , { slug } )
              .then(res => {
                console.log("add to cart succeeded");
                // this.handleFetchOrder();
                // this.setState({ loading: false });
              })
              .catch(err => {
                // this.setState({ error: err, loading: false });
                console.log(err , 'add-to-cart failed ');
              });
          }
        }



      }
      //if there are no items in the State Cart, remove everything from the db
      else {
        /*
        LOOP THROUGH THE SAVED CART AND DELETE EVERY ITEM
        for(savedCartItemIndex ; savedCartItemIndex < savedCart.order_items.length ; savedCartItemIndex++ ){
          authAxios
          .delete( orderItemDeleteURL( savedCart.order_items[savedCartItemIndex].item.id ) )
          .then(res => {
            //callback
            this.handleFetchOrder();
          })
          .catch(err => {
              this.setState( {error: err} );
          });
        }
        */
      }

    }, 100)

    dispatch( removeCart())
  }


}
