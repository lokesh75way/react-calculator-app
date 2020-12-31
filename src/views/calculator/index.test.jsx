import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './index';

describe('Calculator component', () => {
  test('Test component exist', () => {
    render(<Calculator />);

    const calculatorComponent = screen.getByTestId('calculator-component');
    expect(calculatorComponent).toBeInTheDocument();
  });

  test('Test open map button', () => {
    render(<Calculator />);

    const openMap = screen.getByTestId('open-map');
    expect(openMap).toBeInTheDocument();
    fireEvent.click(openMap);
  });

  test('Test Date picker', () => {
    render(<Calculator />);

    const datePicker = screen.getByTestId('date-picker');
    expect(datePicker).toBeInTheDocument();
  });

  test('Test select dropdown', () => {
    render(<Calculator />);

    const selectDropdown = screen.getByTestId('select-dropdown');
    expect(selectDropdown).toBeInTheDocument();
  });

  test('Test form submit', () => {
    render(<Calculator />);

    const submitButton = screen.getByTestId('submit-btn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);
  });
});
