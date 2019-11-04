import React , {Component} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
// import {
//   Container,
//   Divider,
//   Dropdown,
//   Grid,
//   Header,
//   Image,
//   List,
//   Menu,
//   Segment
// } from "semantic-ui-react";



class App extends Component {


  render(){
    return(
      <Router>
        <h1>Hello world!</h1>
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
