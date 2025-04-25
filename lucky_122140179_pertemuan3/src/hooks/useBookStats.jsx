import { useMemo } from 'react';
import { BOOK_STATUS } from '../context/BookContext';

/**
 * Custom hook untuk menghitung statistik dari daftar buku
 * 
 * @param {Array} books - Array berisi objek buku
 * @returns {Object} - Objek berisi statistik buku
 */
const useBookStats = (books) => {
  // Menggunakan useMemo untuk mencegah perhitungan ulang jika books tidak berubah
  const stats = useMemo(() => {
    // Inisialisasi objek statistik
    const initialStats = {
      total: 0,
      [BOOK_STATUS.OWNED]: 0,
      [BOOK_STATUS.READING]: 0,
      [BOOK_STATUS.WISHLIST]: 0,
      authors: {},
      mostPopularAuthor: null,
      recentlyAdded: null
    };
    
    // Jika tidak ada buku, kembalikan statistik awal
    if (!books || books.length === 0) {
      return initialStats;
    }
    
    // Hitung statistik
    const calculatedStats = books.reduce((stats, book) => {
      // Tambahkan ke total dan kategori status
      stats.total++;
      stats[book.status]++;
      
      // Hitung jumlah buku per penulis
      if (!stats.authors[book.author]) {
        stats.authors[book.author] = 1;
      } else {
        stats.authors[book.author]++;
      }
      
      return stats;
    }, { ...initialStats });
    
    // Temukan penulis dengan jumlah buku terbanyak
    let maxCount = 0;
    let mostPopularAuthor = null;
    
    Object.entries(calculatedStats.authors).forEach(([author, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostPopularAuthor = { name: author, count };
      }
    });
    
    calculatedStats.mostPopularAuthor = mostPopularAuthor;
    
    // Temukan buku yang baru ditambahkan (dengan asumsi ID buku adalah timestamp)
    if (books.length > 0) {
      const sortedBooks = [...books].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      calculatedStats.recentlyAdded = sortedBooks[0];
    }
    
    return calculatedStats;
  }, [books]);
  
  return stats;
};

export default useBookStats;