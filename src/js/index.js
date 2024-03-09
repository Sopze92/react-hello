import React from "react";
import ReactDOM from "react-dom";

import "../styles/index.css";

import TrafficLight from "./component/TrafficLight.jsx";

ReactDOM.render(
  (
    <React.StrictMode>
      <TrafficLight />
    </React.StrictMode>
  ), document.getElementById("app"));
