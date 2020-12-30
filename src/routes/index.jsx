import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Calculator from '../views/calculator';
import NotFound from './404';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Calculator} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
