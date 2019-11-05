import React , {Component} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import CustomLayout from "./containers/Layout";
import BaseRouter from "./routes";

import NavigationTabs from "./containers/Home";




class App extends Component {

  render(){
    return(
      <Router>
        <NavigationTabs />
        {/* <CustomLayout>
          <BaseRouter />
        </CustomLayout> */}
      </Router>
    )
  }
}



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Apollo boiiii
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Buy stuff with us
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
