/* eslint-disable react/prop-types */
import React from "react";
import "./App.css";
import { CLIDDialer } from "./features/clid-dialer/CLIDDialer";

function App(props) {
  return (
    <div className="ACSWApp">
      <div className="ACSWApp-body">
        <CLIDDialer interactionId={props.interactionId} />
      </div>
    </div>

  );

}

export default App;
