import React from 'react';
import ReactDom from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {store, persistor} from './redux/store.js';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

ReactDom.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>
);
