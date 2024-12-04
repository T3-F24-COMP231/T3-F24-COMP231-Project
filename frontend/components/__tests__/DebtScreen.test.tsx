import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtsScreen from '@/app/(screens)/debts';
import { IDebt } from '@/types';

jest.mock('@/utils', () => ({
  apiRequest: jest.fn(),
  getToken: jest.fn(() => Promise.resolve('test-token')),
}));

jest.mock('@/hooks', () => ({
  useAuth: jest.fn(() => ({ currentUser: { _id: '123' } })),
  useTheme: jest.fn(() => ({ theme: { purple: '#6200EE', lightGray: '#F5F5F5', text: '#000' } })),
}));

describe('DebtsScreen Component', () => {
  beforeAll(() => {
    jest.useFakeTimers(); // If using timers in your code (e.g., `setTimeout`)
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const debts: IDebt[] = [
    {
      _id: '1',
      title: 'Debt 1',
      amount: 100,
      description: 'Description 1',
      userId: '123',
      date: new Date(),
      paymentReminder: {
        enabled: false,
        amountToPay: 0,
        reminderFrequency: 'monthly',
        reminderDate: new Date(),
      },
    },
    {
      _id: '2',
      title: 'Debt 2',
      amount: 200,
      description: 'Description 2',
      userId: '123',
      date: new Date(),
      paymentReminder: {
        enabled: true,
        amountToPay: 50,
        reminderFrequency: 'weekly',
        reminderDate: new Date(),
      },
    },
  ];

  it('filters debts correctly based on the search query', async () => {
    const { getByPlaceholderText, getByText } = render(<DebtsScreen />);

    // Simulate entering a search query
    const searchInput = getByPlaceholderText('Search debts...');
    fireEvent.changeText(searchInput, 'Debt 1');

    // Assertions
    expect(searchInput.props.value).toBe('Debt 1');
    expect(getByText('Debt 1')).toBeTruthy();
  });

  it('toggles selection mode correctly', async () => {
    const { getByText, queryByText } = render(<DebtsScreen />);

    // Ensure selection mode is off initially
    expect(queryByText('Delete Selected')).toBeNull();

    // Simulate enabling selection mode
    const selectButton = getByText('Select');
    fireEvent.press(selectButton);

    // Ensure selection mode is enabled
    expect(queryByText('Delete Selected')).toBeTruthy();
  });

  it('handles selecting and deselecting debts', async () => {
    const { getByTestId, getByText } = render(<DebtsScreen />);

    // Simulate enabling selection mode
    fireEvent.press(getByText('Select'));

    // Simulate selecting a debt
    const checkbox = getByTestId('checkbox-1');
    fireEvent(checkbox, 'onValueChange', true);

    // Simulate deselecting the debt
    fireEvent(checkbox, 'onValueChange', false);

    // Assertions
    expect(getByText('Debt 1')).toBeTruthy();
  });
});
