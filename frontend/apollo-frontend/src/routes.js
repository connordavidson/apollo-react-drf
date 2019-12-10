import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";

//new
import OrderSummary from './containers/OrderSummary';
import Checkout from './containers/Checkout/Checkout';
import ProductDetail from './containers/ProductDetail';
import Profile from './containers/Profile/Profile';
import BuyTab from './containers/NavigationTabs/BuyTab/BuyTab';
import MyOrders from './containers/Profile/MyOrders';


const BaseRouter = () => (
  <Hoc>

    {/*for searching, use syntax similar to ProductDetail Route below.. access the parameters inside the component */} 
    <Route exact path="/buyTab" component={BuyTab} />
    <Route exact path="/order-summary" component={OrderSummary} />
    <Route exact path="/checkout" component={Checkout} />



    <Route exact path="/products/:productID" component={ProductDetail} />


    <Route exact path="/profile/my-orders" component={MyOrders} />
    <Route exact path="/profile" component={Profile} />



    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route exact path="/" component={HomepageLayout} />


  </Hoc>
);

export default BaseRouter;
