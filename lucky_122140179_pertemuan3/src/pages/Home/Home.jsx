import React from 'react';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import { useBookContext } from '../../context/BookContext';
import './Home.css';

/**
 * Halaman utama yang menampilkan daftar buku dan filter
 */
const Home = () => {
  const { books } = useBookContext();
  
  return (
    <div className="home-page">
      <section className="filter-section">
        <BookFilter />
        
        <div className="book-count">
          <p>Total buku: <strong>{books.length}</strong></p>
        </div>
      </section>
      
      <section className="book-list-section">
        <BookList />
      </section>
    </div>
  );
};

export default Home;