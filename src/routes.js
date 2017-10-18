import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Home from './containers/Home';
import Page1 from './containers/Page1';
import NoMatch from './containers/NoMatch';

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/home" component={Home} />
      <Route path="/page1" component={Page1} />
      <Route component={NoMatch} />
    </Switch>
  </Router>
);
