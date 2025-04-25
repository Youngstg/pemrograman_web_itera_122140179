import { useState, useEffect } from 'react';

/**
 * Custom hook untuk menyimpan dan mengambil data dari localStorage
 * 
 * @param {string} key - Kunci untuk menyimpan data di localStorage
 * @param {any} initialValue - Nilai awal jika tidak ada data di localStorage
 * @returns {[any, function]} - Array berisi nilai dan fungsi untuk mengubahnya
 */
const useLocalStorage = (key, initialValue) => {
  // Fungsi untuk mendapatkan nilai dari localStorage
  const getStoredValue = () => {
    try {
      // Cek apakah localStorage tersedia
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return initialValue;
    }
  };

  // State untuk menyimpan nilai
  const [value, setValue] = useState(getStoredValue);

  // Update localStorage ketika nilai berubah
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;