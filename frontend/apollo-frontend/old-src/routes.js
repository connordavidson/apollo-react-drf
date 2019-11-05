import React from 'react';
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import NavigationTabs from "./containers/Home";



const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" component={NavigationTabs} />


  </Hoc>
);


export default BaseRouter;
