import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookFilter from './BookFilter';
import { BookProvider, BOOK_STATUS } from '../../context/BookContext';

// Helper function untuk render dengan provider
const renderWithProvider = () => {
  return render(
    <BookProvider>
      <BookFilter />
    </BookProvider>
  );
};

describe('BookFilter Component', () => {
  test('renders filter elements correctly', () => {
    renderWithProvider();
    
    // Cek label dan elemen filter
    expect(screen.getByLabelText(/filter berdasarkan status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cari buku/i)).toBeInTheDocument();
    expect(screen.getByText('Reset Filter')).toBeInTheDocument();
    
    // Cek opsi filter status
    const filterSelect = screen.getByLabelText(/filter berdasarkan status/i);
    expect(filterSelect).toHaveValue('semua');
    expect(screen.getByText('Semua Buku')).toBeInTheDocument();
    expect(screen.getByText('Sudah Dimiliki')).toBeInTheDocument();
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument();
    expect(screen.getByText('Ingin Dibeli')).toBeInTheDocument();
  });

  test('updates filter when status is changed', () => {
    renderWithProvider();
    
    // Pilih opsi filter status
    const filterSelect = screen.getByLabelText(/filter berdasarkan status/i);
    fireEvent.change(filterSelect, { target: { value: BOOK_STATUS.READING } });
    
    // Cek nilai filter diperbarui
    expect(filterSelect).toHaveValue(BOOK_STATUS.READING);
  });

  test('updates search term when search input is changed', () => {
    renderWithProvider();
    
    // Masukkan kata kunci pencarian
    const searchInput = screen.getByLabelText(/cari buku/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Cek nilai input diperbarui
    expect(searchInput).toHaveValue('test search');
    
    // Cek tombol hapus pencarian muncul
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  test('clears search when clear button is clicked', () => {
    renderWithProvider();
    
    // Masukkan kata kunci pencarian
    const searchInput = screen.getByLabelText(/cari buku/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Klik tombol hapus pencarian
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    
    // Cek nilai input direset
    expect(searchInput).toHaveValue('');
  });

  test('resets all filters when reset button is clicked', () => {
    renderWithProvider();
    
    // Set filter status
    const filterSelect = screen.getByLabelText(/filter berdasarkan status/i);
    fireEvent.change(filterSelect, { target: { value: BOOK_STATUS.WISHLIST } });
    
    // Set kata kunci pencarian
    const searchInput = screen.getByLabelText(/cari buku/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Klik tombol reset
    const resetButton = screen.getByText('Reset Filter');
    fireEvent.click(resetButton);
    
    // Cek nilai filter dan pencarian direset
    expect(filterSelect).toHaveValue('semua');
    expect(searchInput).toHaveValue('');
  });

  test('disables reset button when no filters are applied', () => {
    renderWithProvider();
    
    // Cek tombol reset disabled pada kondisi awal
    const resetButton = screen.getByText('Reset Filter');
    expect(resetButton).toBeDisabled();
    
    // Apply filter
    const filterSelect = screen.getByLabelText(/filter berdasarkan status/i);
    fireEvent.change(filterSelect, { target: { value: BOOK_STATUS.READING } });
    
    // Cek tombol reset enabled
    expect(resetButton).not.toBeDisabled();
    
    // Reset filter
    fireEvent.click(resetButton);
    
    // Cek tombol reset kembali disabled
    expect(resetButton).toBeDisabled();
  });
});