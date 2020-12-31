import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Calculator from '../views/calculator';
import NotFound from './404';

const Routes = () => {
  return (
    <div data-testid="routes-component">
      <Switch>
        <Route path="/" exact component={Calculator} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default Routes;
