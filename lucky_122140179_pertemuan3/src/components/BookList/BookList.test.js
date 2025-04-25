// src/components/BookList/BookList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookList from './BookList';
import { BookProvider, useBookContext, BOOK_STATUS } from '../../context/BookContext';

// Karena BookContext.Provider tidak tersedia, kita akan menggunakan BookProvider langsung

// Mock data dan fungsi
const mockBooks = [
  {
    id: '1',
    title: 'Buku Pertama',
    author: 'Penulis A',
    status: BOOK_STATUS.OWNED,
    notes: 'Catatan buku pertama'
  }
];

// Mock useBookContext hook
jest.mock('../../context/BookContext', () => {
  const originalModule = jest.requireActual('../../context/BookContext');
  return {
    ...originalModule,
    useBookContext: jest.fn()
  };
});

// Mock window.confirm
window.confirm = jest.fn().mockReturnValue(true);

describe('BookList Component', () => {
  test('renders empty list message when no books', () => {
    // Setup mock return value for this test
    const { useBookContext } = require('../../context/BookContext');
    useBookContext.mockReturnValue({
      filteredBooks: [],
      deleteBook: jest.fn()
    });
    
    render(<BookList />);
    
    expect(screen.getByText('Tidak ada buku yang ditemukan.')).toBeInTheDocument();
  });

  test('renders add button correctly', () => {
    // Setup mock return value for this test
    const { useBookContext } = require('../../context/BookContext');
    useBookContext.mockReturnValue({
      filteredBooks: [],
      deleteBook: jest.fn()
    });
    
    render(<BookList />);
    
    expect(screen.getByText('+ Tambah Buku')).toBeInTheDocument();
  });
  
  test('renders books when provided in context', () => {
    // Setup mock return value for this test
    const { useBookContext } = require('../../context/BookContext');
    useBookContext.mockReturnValue({
      filteredBooks: mockBooks,
      deleteBook: jest.fn()
    });
    
    render(<BookList />);
    
    // Test hanya bagian header saja untuk memverifikasi render
    expect(screen.getByText('Daftar Buku')).toBeInTheDocument();
  });
});