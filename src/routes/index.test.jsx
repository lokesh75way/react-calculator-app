import React from 'react';
import { render, screen } from '@testing-library/react';
import Routes from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Routes component', () => {
  test('Test component exist', () => {
    render(
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );

    const routesComponent = screen.getByTestId('routes-component');
    expect(routesComponent).toBeInTheDocument();
  });
});
