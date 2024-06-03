import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Reddit from "./components/Reddit/Reddit";

function App() {
  return (
    <Provider store={store}>
      <Reddit />
    </Provider>
  );
}

export default App;
