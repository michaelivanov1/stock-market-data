import React from "react";
import { render } from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

render(
  // when app is done, remove strict mode to surpress all warnings
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.querySelector("#root")
);