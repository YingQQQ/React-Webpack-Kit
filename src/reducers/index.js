import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from '../utils/history';
import locationChange from './locationChange';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    locationChange,
    router: connectRouter(history),
    ...injectedReducers
  });
  return rootReducer;
}
