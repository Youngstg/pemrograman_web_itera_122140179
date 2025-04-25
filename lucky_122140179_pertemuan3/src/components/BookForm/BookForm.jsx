import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBookContext, BOOK_STATUS } from '../../context/BookContext';
import './BookForm.css';

/**
 * Komponen form untuk menambah atau mengedit buku
 */
const BookForm = ({ bookToEdit, onClose }) => {
  const { addBook, editBook } = useBookContext();
  const isEditing = !!bookToEdit;
  
  // State untuk form fields
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: BOOK_STATUS.OWNED,
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Jika mode edit, isi form dengan data buku yang akan diedit
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        id: bookToEdit.id,
        title: bookToEdit.title,
        author: bookToEdit.author,
        status: bookToEdit.status,
        notes: bookToEdit.notes || ''
      });
    }
  }, [bookToEdit]);
  
  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Hapus error untuk field yang diubah
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Format data untuk dikirim
    const bookData = {
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim(),
      notes: formData.notes.trim()
    };
    
    // Simpan data buku
    if (isEditing) {
      editBook(bookData);
    } else {
      addBook(bookData);
    }
    
    // Reset form dan tutup modal
    setFormData({
      title: '',
      author: '',
      status: BOOK_STATUS.OWNED,
      notes: ''
    });
    
    onClose();
  };
  
  return (
    <div className="book-form-container">
      <form className="book-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
        
        <div className="form-group">
          <label htmlFor="title">Judul Buku:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Penulis:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={errors.author ? 'error' : ''}
          />
          {errors.author && <span className="error-message">{errors.author}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value={BOOK_STATUS.OWNED}>Sudah Dimiliki</option>
            <option value={BOOK_STATUS.READING}>Sedang Dibaca</option>
            <option value={BOOK_STATUS.WISHLIST}>Ingin Dibeli</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Catatan (opsional):</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="submit-button">
            {isEditing ? 'Simpan Perubahan' : 'Tambah Buku'}
          </button>
        </div>
      </form>
    </div>
  );
};

BookForm.propTypes = {
  bookToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.values(BOOK_STATUS)).isRequired,
    notes: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

BookForm.defaultProps = {
  bookToEdit: null
};

export default BookForm;