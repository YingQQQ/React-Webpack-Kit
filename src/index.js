import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import configureStore from './store/configuerStore';
import history from './utils/history';
import Routes from './routes';

const rootEl = window.document.getElementById('app');
const initialState = {};
const store = configureStore(initialState, history);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  rootEl
);
