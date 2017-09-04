import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './containers/app';

const rootEl = window.document.getElementById('app');


const renderDom = Component => render(
  <AppContainer>
    <Component />
  </AppContainer>,
  rootEl
);

renderDom(App);

if (module.hot) {
  module.hot.accept('./App', () => renderDom(App));
}
