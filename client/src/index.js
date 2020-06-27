import React from "react";
import ReactDOM from "react-dom";
//import "./index.css";
import App from "./App";
// import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import Thunk from "redux-thunk";
import reducers from "./reducers";
import "./index.css";

const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;
const enhancer = composeEnhancers(
    applyMiddleware(Thunk)
    // other store enhancers if any
);
const store = createStore(reducers, enhancer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
