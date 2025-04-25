import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookProvider, useBookContext } from './BookContext';

// Komponen sederhana untuk mengakses context
const TestConsumer = () => {
  const context = useBookContext();
  return <div data-testid="test-context">{context ? 'Context exists' : 'No context'}</div>;
};

describe('BookContext', () => {
  test('provides context to children components', () => {
    const { getByTestId } = render(
      <BookProvider>
        <TestConsumer />
      </BookProvider>
    );
    expect(getByTestId('test-context')).toHaveTextContent('Context exists');
  });
});