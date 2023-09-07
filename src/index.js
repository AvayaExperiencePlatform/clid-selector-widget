import React from "react";
import ReactDOM from "react-dom";
import ReactHTMLElement from "react-html-element";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import "@avaya/neo-react/avaya-neo-react.css";

class CLIDDialerWidget extends ReactHTMLElement {
  connectedCallback() {
    const interactionId = this.getAttribute('interactionid');
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(
        <React.StrictMode>
          <Provider store={store}>
            <App interactionId={interactionId} />
          </Provider>
        </React.StrictMode>,
        this
      );
  }
}
customElements.define("clid-selector", CLIDDialerWidget);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
