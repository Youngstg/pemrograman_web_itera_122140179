import React from 'react';
import { useBookContext, BOOK_STATUS } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import './Stats.css';

/**
 * Komponen untuk menampilkan statistik buku dalam bentuk card
 */
const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <h3>{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
    </div>
  );
};

/**
 * Halaman statistik yang menampilkan informasi dan statistik tentang koleksi buku
 */
const Stats = () => {
  const { books } = useBookContext();
  const stats = useBookStats(books);
  
  // Icon sederhana menggunakan karakter unicode
  const icons = {
    total: '📚',
    owned: '📕',
    reading: '📖',
    wishlist: '🛒',
    author: '✍️',
    recent: '🆕'
  };
  
  // Format tanggal untuk buku terbaru
  const formatDate = (id) => {
    if (!id) return 'Tidak ada';
    const date = new Date(parseInt(id));
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="stats-page">
      <h2>Statistik Koleksi Buku</h2>
      
      <div className="stats-grid">
        <StatsCard 
          title="Total Buku" 
          value={stats.total} 
          icon={icons.total} 
        />
        
        <StatsCard 
          title="Buku Dimiliki" 
          value={stats[BOOK_STATUS.OWNED]} 
          icon={icons.owned} 
        />
        
        <StatsCard 
          title="Sedang Dibaca" 
          value={stats[BOOK_STATUS.READING]} 
          icon={icons.reading} 
        />
        
        <StatsCard 
          title="Ingin Dibeli" 
          value={stats[BOOK_STATUS.WISHLIST]} 
          icon={icons.wishlist} 
        />
      </div>
      
      <div className="additional-stats">
        <div className="stats-section">
          <h3>Penulis Terpopuler</h3>
          {stats.mostPopularAuthor ? (
            <div className="popular-author">
              <p className="author-name">{stats.mostPopularAuthor.name}</p>
              <p className="author-count">{stats.mostPopularAuthor.count} buku</p>
            </div>
          ) : (
            <p>Belum ada data</p>
          )}
        </div>
        
        <div className="stats-section">
          <h3>Buku Terakhir Ditambahkan</h3>
          {stats.recentlyAdded ? (
            <div className="recent-book">
              <p className="book-title">{stats.recentlyAdded.title}</p>
              <p className="book-author">oleh {stats.recentlyAdded.author}</p>
              <p className="book-date">Ditambahkan pada {formatDate(stats.recentlyAdded.id)}</p>
            </div>
          ) : (
            <p>Belum ada buku</p>
          )}
        </div>
      </div>
      
      {books.length > 0 && (
        <div className="authors-list">
          <h3>Daftar Penulis</h3>
          <ul>
            {Object.entries(stats.authors)
              .sort(([, countA], [, countB]) => countB - countA)
              .map(([author, count]) => (
                <li key={author}>
                  <span className="author-name">{author}</span>
                  <span className="author-count">{count} buku</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Stats;