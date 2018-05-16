import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import SubHome from './SubHome';

export default () => (
  <div>
    <p>HomePage</p>
    <Link to="/home/subHome">Link Home</Link>
    <Link to="/">Home</Link>
    <Switch>
      <Route path="/home/subHome" component={SubHome} />
    </Switch>
  </div>
);
