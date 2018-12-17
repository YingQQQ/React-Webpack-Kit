import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import createReducer from '../reducers';

export default function configureStore(initialState = {}, history) {
  // 创建一个仓库,包含中间件
  // routerMiddleware: 同步location/URL到 state
  const middlewares = [thunk, routerMiddleware(history)];

  const enhancers = [applyMiddleware(...middlewares)];
  // 如果 Redux DevTools Extension 则使用,否则使用Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers = process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;
  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers)
  );

  store.injectedReducers = {}; // 注册reducers

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}
