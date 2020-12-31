import React from 'react';
import { render, screen } from '@testing-library/react';
import Map from './map';

describe('Map component', () => {
  test('Test component exist', () => {
    render(<Map />);

    const mapComponent = screen.getByTestId('map-component');
    expect(mapComponent).toBeInTheDocument();
  });
});
