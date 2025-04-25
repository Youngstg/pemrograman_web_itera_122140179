import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from './BookForm';
import { BookProvider, BOOK_STATUS } from '../../context/BookContext';

// Mock fungsi untuk callback onClose
const mockOnClose = jest.fn();

// Helper function untuk render komponen dengan provider
const renderWithProvider = (ui) => {
  return render(
    <BookProvider>
      {ui}
    </BookProvider>
  );
};

describe('BookForm Component', () => {
  beforeEach(() => {
    // Reset mock functions
    mockOnClose.mockClear();
  });

  test('renders form fields correctly', () => {
    renderWithProvider(<BookForm onClose={mockOnClose} />);
    
    // Cek judul form
    expect(screen.getByText('Tambah Buku Baru')).toBeInTheDocument();
    
    // Cek field input
    expect(screen.getByLabelText(/judul buku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/penulis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/catatan/i)).toBeInTheDocument();
    
    // Cek tombol
    expect(screen.getByText('Batal')).toBeInTheDocument();
    expect(screen.getByText('Tambah Buku')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    renderWithProvider(<BookForm onClose={mockOnClose} />);
    
    // Klik tombol batal
    fireEvent.click(screen.getByText('Batal'));
    
    // Verifikasi onClose dipanggil
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('shows validation errors when form is submitted with empty fields', () => {
    renderWithProvider(<BookForm onClose={mockOnClose} />);
    
    // Submit form kosong
    fireEvent.click(screen.getByText('Tambah Buku'));
    
    // Cek pesan error muncul
    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi')).toBeInTheDocument();
    
    // onClose tidak dipanggil
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('populates form with book data in edit mode', () => {
    const bookToEdit = {
      id: '1234567890',
      title: 'Buku Test',
      author: 'Penulis Test',
      status: BOOK_STATUS.READING,
      notes: 'Catatan test'
    };
    
    renderWithProvider(<BookForm bookToEdit={bookToEdit} onClose={mockOnClose} />);
    
    // Cek judul form dalam mode edit
    expect(screen.getByText('Edit Buku')).toBeInTheDocument();
    
    // Cek nilai field sesuai dengan data buku
    expect(screen.getByLabelText(/judul buku/i)).toHaveValue('Buku Test');
    expect(screen.getByLabelText(/penulis/i)).toHaveValue('Penulis Test');
    expect(screen.getByLabelText(/status/i)).toHaveValue(BOOK_STATUS.READING);
    expect(screen.getByLabelText(/catatan/i)).toHaveValue('Catatan test');
    
    // Cek tombol dalam mode edit
    expect(screen.getByText('Simpan Perubahan')).toBeInTheDocument();
  });

  test('removes validation errors when fields are filled', () => {
    renderWithProvider(<BookForm onClose={mockOnClose} />);
    
    // Submit form kosong untuk memunculkan error
    fireEvent.click(screen.getByText('Tambah Buku'));
    
    // Cek pesan error muncul
    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument();
    
    // Isi field judul
    fireEvent.change(screen.getByLabelText(/judul buku/i), {
      target: { value: 'Buku Baru' }
    });
    
    // Cek pesan error hilang
    expect(screen.queryByText('Judul buku wajib diisi')).not.toBeInTheDocument();
  });
});