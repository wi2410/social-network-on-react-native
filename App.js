import React from 'react';
import {Provider} from 'react-redux';
import { Main } from "./components/Main";
import { store } from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
