import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import counterApp from "./reducers";
import App from "components/App";
import process from "process/browser";

const store = createStore(
  counterApp,
  (module.hot && module.hot.data && module.hot.data.counter) || 0
);

window.process = process;

const load = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector("#app")
  );
};

if (document.readyState !== "complete") {
  document.addEventListener("DOMContentLoaded", load);
} else {
  load();
}
