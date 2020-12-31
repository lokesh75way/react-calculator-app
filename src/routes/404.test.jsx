import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './404';
import { BrowserRouter } from 'react-router-dom';

describe('NotFound component', () => {
  test('Test component exist', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    const notFoundComponent = screen.getByTestId('not-found-component');
    expect(notFoundComponent).toBeInTheDocument();
  });

  test('Test link button', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/');
  });

  test('Test 404 exists', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const notFound = screen.getByText(RegExp('404'));
    expect(notFound).toBeInTheDocument();
  });
});
