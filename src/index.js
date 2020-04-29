
import React from "react";
import ReactDOM from "react-dom";
import {Counter} from './counter'
// import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// const App = () => {
//   return <div>Hello React,Webpack 4 & Babel 7!</div>;
// };

ReactDOM.render(<Counter />, document.querySelector("#root"));