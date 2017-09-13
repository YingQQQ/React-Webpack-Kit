import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Page1 from './containers/Page1';

export default () => (
  <Switch>
    <Route exact path="/" component={App} />
    <Route path="/home" component={Home} />
    <Route path="/page1" component={Page1} />
  </Switch>
);
