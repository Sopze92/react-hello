import React from "react";
import ReactDOM from "react-dom";

import "../styles/index.css";

import TodoList from "./component/TodoList.jsx";

ReactDOM.render(
  (
    <React.StrictMode>
      <TodoList />
    </React.StrictMode>
  ), document.getElementById("app"));
