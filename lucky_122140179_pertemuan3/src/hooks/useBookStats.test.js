import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useBookStats from './useBookStats';
import { BOOK_STATUS } from '../context/BookContext';

// Komponen test untuk mengekspos hasil hooks
const TestComponent = ({ books }) => {
  const stats = useBookStats(books);
  return (
    <div>
      <div data-testid="total">{stats.total}</div>
      <div data-testid="owned">{stats[BOOK_STATUS.OWNED]}</div>
      <div data-testid="reading">{stats[BOOK_STATUS.READING]}</div>
      <div data-testid="wishlist">{stats[BOOK_STATUS.WISHLIST]}</div>
    </div>
  );
};

describe('useBookStats Hook', () => {
  test('returns empty stats for empty book array', () => {
    render(<TestComponent books={[]} />);
    
    expect(screen.getByTestId('total')).toHaveTextContent('0');
    expect(screen.getByTestId('owned')).toHaveTextContent('0');
    expect(screen.getByTestId('reading')).toHaveTextContent('0');
    expect(screen.getByTestId('wishlist')).toHaveTextContent('0');
  });
  
  test('calculates basic stats correctly', () => {
    const books = [
      {
        id: '1',
        title: 'Book 1',
        author: 'Author A',
        status: BOOK_STATUS.OWNED,
        notes: ''
      },
      {
        id: '2',
        title: 'Book 2',
        author: 'Author B',
        status: BOOK_STATUS.READING,
        notes: ''
      },
      {
        id: '3',
        title: 'Book 3',
        author: 'Author A',
        status: BOOK_STATUS.WISHLIST,
        notes: ''
      }
    ];
    
    render(<TestComponent books={books} />);
    
    expect(screen.getByTestId('total')).toHaveTextContent('3');
    expect(screen.getByTestId('owned')).toHaveTextContent('1');
    expect(screen.getByTestId('reading')).toHaveTextContent('1');
    expect(screen.getByTestId('wishlist')).toHaveTextContent('1');
  });
});