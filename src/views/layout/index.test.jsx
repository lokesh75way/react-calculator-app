import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Layout component', () => {
  test('Test component exist', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    const layoutComponent = screen.getByTestId('layout-component');
    expect(layoutComponent).toBeInTheDocument();
  });
});
