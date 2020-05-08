import React from "react";
import { render } from "react-dom";
import "./styles.css";
import DragAndDrop from "./DragAndDrop";

function App() {
  return (
    <div>
      <DragAndDrop />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
