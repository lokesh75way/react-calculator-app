import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../views/home';
import NotFound from './404';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
