import React from "react";
import ReactDOM from "react-dom";

import "../styles/index.css";

import TimeCounter from "./component/TimeCounter.jsx";

/**
 * +/-      - set the initial time, will be preserved even if you stop/reset the timer
 * 
 * pause    - pause/resume a started count
 * start    - start counting from initial time (or zero if not set)
 * stop     - stops the counter, stopped time will be displayed until reseted/started
 * reset    - reset the counter to initial time or zero, press it twice when stopped to reset initial time
 * 
 * this looks like the instructions of an ali-express item
 */

ReactDOM.render(
  (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
      <TimeCounter />
    </div>
  ), document.querySelector("#app"));
