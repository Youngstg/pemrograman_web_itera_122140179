import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBookContext, BOOK_STATUS } from '../../context/BookContext';
import BookForm from '../BookForm/BookForm';
import './BookList.css';

/**
 * Komponen untuk menampilkan status buku dalam bentuk badge
 */
const StatusBadge = ({ status }) => {
  const statusClasses = {
    [BOOK_STATUS.OWNED]: 'badge-owned',
    [BOOK_STATUS.READING]: 'badge-reading',
    [BOOK_STATUS.WISHLIST]: 'badge-wishlist'
  };
  
  const statusLabels = {
    [BOOK_STATUS.OWNED]: 'Dimiliki',
    [BOOK_STATUS.READING]: 'Sedang Dibaca',
    [BOOK_STATUS.WISHLIST]: 'Ingin Dibeli'
  };
  
  return (
    <span className={`status-badge ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(BOOK_STATUS)).isRequired
};

/**
 * Komponen untuk menampilkan daftar buku dan melakukan operasi terhadap buku
 */
const BookList = () => {
  const { filteredBooks, deleteBook } = useBookContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Handle edit book
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowForm(true);
  };
  
  // Handle delete book dengan konfirmasi
  const handleDeleteBook = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) {
      deleteBook(id);
    }
  };
  
  // Handle close form
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBook(null);
  };
  
  // Handle open add form
  const handleAddNew = () => {
    setSelectedBook(null);
    setShowForm(true);
  };
  
  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>Daftar Buku</h2>
        <button className="add-button" onClick={handleAddNew}>
          + Tambah Buku
        </button>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="empty-list">
          <p>Tidak ada buku yang ditemukan.</p>
          <p>Silakan tambahkan buku baru atau ubah filter pencarian.</p>
        </div>
      ) : (
        <div className="book-cards">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-card-header">
                <h3 className="book-title">{book.title}</h3>
                <StatusBadge status={book.status} />
              </div>
              
              <p className="book-author">Oleh: {book.author}</p>
              
              {book.notes && (
                <div className="book-notes">
                  <p>{book.notes}</p>
                </div>
              )}
              
              <div className="book-card-actions">
                <button 
                  className="edit-button" 
                  onClick={() => handleEditBook(book)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteBook(book.id, book.title)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showForm && (
        <div className="modal-overlay">
          <BookForm 
            bookToEdit={selectedBook} 
            onClose={handleCloseForm} 
          />
        </div>
      )}
    </div>
  );
};

export default BookList;