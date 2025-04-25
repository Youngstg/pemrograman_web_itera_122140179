import React from 'react';
import { useBookContext, BOOK_STATUS } from '../../context/BookContext';
import './BookFilter.css';

/**
 * Komponen untuk memfilter buku berdasarkan status dan kata kunci pencarian
 */
const BookFilter = () => {
  const { filter, setFilter, searchTerm, setSearchTerm } = useBookContext();
  
  // Handle perubahan filter status
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  // Handle perubahan kata kunci pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle reset filter
  const handleResetFilter = () => {
    setFilter('semua');
    setSearchTerm('');
  };
  
  return (
    <div className="book-filter">
      <div className="filter-section">
        <label htmlFor="status-filter">Filter berdasarkan status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="semua">Semua Buku</option>
          <option value={BOOK_STATUS.OWNED}>Sudah Dimiliki</option>
          <option value={BOOK_STATUS.READING}>Sedang Dibaca</option>
          <option value={BOOK_STATUS.WISHLIST}>Ingin Dibeli</option>
        </select>
      </div>
      
      <div className="search-section">
        <label htmlFor="search-input">Cari buku:</label>
        <div className="search-input-container">
          <input
            id="search-input"
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <button 
        className="reset-filter-button" 
        onClick={handleResetFilter}
        disabled={filter === 'semua' && searchTerm === ''}
      >
        Reset Filter
      </button>
    </div>
  );
};

export default BookFilter;