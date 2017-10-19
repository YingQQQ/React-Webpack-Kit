import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import Routes from './routes';
import configureStore from './store/configuerStore';

injectTapEventPlugin();
const rootEl = window.document.getElementById('app');
const store = configureStore();
const history = createHistory();


const renderDom = Component => render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  rootEl
);

renderDom(Routes);

if (module.hot) {
  module.hot.accept('./routes', () => renderDom(Routes));
}

