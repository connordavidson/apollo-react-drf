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
  orderItemDeleteURL,

} from '../../constants';



/*
**TO DO**
need to rework removeCartOnLogout() to be more efficient and Human-Readable
*/



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

  return dispatch => {
    dispatch(cartStart());
    dispatch( addToCart(newOrderItem) )
  }

};





/* seems to work as expected.. for now (12/5/19)
This function is kind of sloppy and will definitely need revision in the future.
Premise of this function:
  when the user logs out, the cart that they have in their state needs to be added to the Database, so that it can be loaded next time they Login
To achieve this goal, I decided to retrieve the cart from the database and compare it to the Cart currently in the State.
  when comparing them, it creates two Arrays. One for the items that are you unique to the Database Cart and one for items that are Unique to the State Cart
  If the user has something saved in the Database Cart but it is not in their State CArt (namely, they deleted it from their cart after they logged in)
    then delete that item
  If the user has something in their State Cart that is not in the database (namely, they added it after they logged in)
    then add that item to the database
*/
export const removeCartOnLogout = (token) => {
  return (dispatch, getState) => {

    //getState gets the state from the Redux Store
    const stateCart = getState().cart.shoppingCart
    let savedCart = null
    let itemsMatch = false
    let stateCartItemIndex = 0
    let savedCartItemIndex = 0
    let uniqueToDatabase = []
    let uniqueToState = []

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



    //sets a timeout in order to give time for a response in the axios.get() above
    setTimeout( () => {
        //if the item is not already saved in the DB, insert it if it is already in the db, ignore it
        //these nested loops are used to find the order_items that are unique to the Cart stored in the database.
        //it starts by looping through every item in the State Cart and comparing it to every item in the Saved Cart.
        //if they are not the same, it stores the index of the item in the uniqueToDatabase array
        if(stateCart.order_items.length > 0){
          for(stateCartItemIndex ; stateCartItemIndex < stateCart.order_items.length; stateCartItemIndex++){
            for(savedCartItemIndex ; savedCartItemIndex < savedCart.order_items.length ; savedCartItemIndex++ ){
              itemsMatch = false
              if( stateCart.order_items[stateCartItemIndex].item.id === savedCart.order_items[savedCartItemIndex].item.id ){
                itemsMatch = true;
              }
              //if the items don't match, add the index of the item from the DB into the uniqueToDatabase array
              if(!itemsMatch){
                uniqueToDatabase.push(savedCartItemIndex)
              }
            }
          }
        }
        //if the length of the State Cart is 0..
        else{
          //if there is nothing in the State Cart, remove all the items from the Saved Cart
          for(let i = 0 ; i < savedCart.order_items.length ; i++){
            //console.log('savedCart.order_items[uniqueToDatabase[i]].id inside DELETE: ', savedCart.order_items[uniqueToDatabase[i]].id)
            axios
              .create({
                baseURL: 'http://127.0.0.1:8000/api' ,
                headers: {
                  Authorization: `Token ${token}`
                }
              })
              .delete( orderItemDeleteURL( savedCart.order_items[i].id) )
              //.delete( addToCartURL , { slug } )
              .catch(err => {
                // this.setState({ error: err, loading: false });
                console.log(err , 'add-to-cart failed ');
              });
          }
        }
        console.log('uniqueToDatabase array: ', uniqueToDatabase)
        //loops through the uniqueToDatabase array and removes the item from the Saved Cart in the database
        //"if there is something in the Database that isn't in the state, remove it"
        if(uniqueToDatabase.length > 0){
          for(let i = 0 ; i < uniqueToDatabase.length ; i++){
            console.log('savedCart.order_items[uniqueToDatabase[i]].id inside DELETE: ', savedCart.order_items[uniqueToDatabase[i]].id)
            axios
              .create({
                baseURL: 'http://127.0.0.1:8000/api' ,
                headers: {
                  Authorization: `Token ${token}`
                }
              })
              .delete( orderItemDeleteURL( savedCart.order_items[uniqueToDatabase[i]].id) )
              //.delete( addToCartURL , { slug } )
              .catch(err => {
                // this.setState({ error: err, loading: false });
                console.log(err , 'add-to-cart failed ');
              });
          }
        }


      setTimeout( () => {
        //this if uses very similar logic the the If above it
        //this checks to make sure that the database doesn't have any items that are not in the state
        if( savedCart.order_items.length > 0 ){
          stateCartItemIndex = 0
          savedCartItemIndex = 0
          for(savedCartItemIndex ; savedCartItemIndex < savedCart.order_items.length ; savedCartItemIndex++ ){
            for(stateCartItemIndex ; stateCartItemIndex < stateCart.order_items.length; stateCartItemIndex++){
              itemsMatch = false
              if( stateCart.order_items[stateCartItemIndex].item.id === savedCart.order_items[savedCartItemIndex].item.id ){
                itemsMatch = true;
              }
              if(!itemsMatch){
                uniqueToState.push(stateCartItemIndex)
              }
            }
          }
          console.log('uniqueToState array : ', uniqueToState)

        }
        else {
          //this loops goes through the State Cart and adds all the items to the Saved Cart
          for(let i = 0 ; i < stateCart.order_items.length ; i++){
            //console.log('savedCart.order_items[uniqueToDatabase[i]].id inside DELETE: ', savedCart.order_items[uniqueToDatabase[i]].id)
            const slug = stateCart.order_items[i].item.slug
            axios
              .create({
                baseURL: 'http://127.0.0.1:8000/api' ,
                headers: {
                  Authorization: `Token ${token}`
                }
              })
              .post( addToCartURL , { slug } )
              .catch(err => {
                // this.setState({ error: err, loading: false });
                console.log(err , 'add-to-cart failed ');
              });
          }
        }

        if(uniqueToState.length > 0 ) {
          //loops through the uniqueToDatabase array and adds the item to the Saved Cart in the database
          for(let i = 0 ; i < uniqueToState.length ; i++){
            const slug = stateCart.order_items[uniqueToState[i]].item.slug
            axios
              .create({
                baseURL: 'http://127.0.0.1:8000/api' ,
                headers: {
                  Authorization: `Token ${token}`
                }
              })
              .post( addToCartURL , { slug } )
              .catch(err => {
                // this.setState({ error: err, loading: false });
                console.log(err , 'add-to-cart failed ');
              });
          }
        }

      //a delay of 1 second
      }, 1000)
    //a delay of 1 second
    }, 1000)

    //clears the cart out of the state and out of the local storage
    dispatch( removeCart())
  }


}
