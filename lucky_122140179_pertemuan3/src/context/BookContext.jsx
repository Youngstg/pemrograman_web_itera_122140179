import React, { createContext, useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

// Context untuk state management
const BookContext = createContext();

// Status buku
export const BOOK_STATUS = {
  OWNED: 'milik',
  READING: 'baca',
  WISHLIST: 'beli'
};

// Action types
const ADD_BOOK = 'ADD_BOOK';
const EDIT_BOOK = 'EDIT_BOOK';
const DELETE_BOOK = 'DELETE_BOOK';
const SET_FILTER = 'SET_FILTER';
const SET_SEARCH = 'SET_SEARCH';

// Reducer untuk mengelola state
const bookReducer = (state, action) => {
  switch (action.type) {
    case ADD_BOOK:
      return {
        ...state,
        books: [...state.books, { ...action.payload, id: Date.now().toString() }]
      };
    case EDIT_BOOK:
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        )
      };
    case DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload)
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
    case SET_SEARCH:
      return {
        ...state,
        searchTerm: action.payload
      };
    default:
      return state;
  }
};

// Provider Component
export const BookProvider = ({ children }) => {
  const [savedBooks, setSavedBooks] = useLocalStorage('books', []);
  
  const initialState = {
    books: savedBooks,
    filter: 'semua',
    searchTerm: ''
  };
  
  const [state, dispatch] = useReducer(bookReducer, initialState);
  
  // Simpan buku ke localStorage setiap kali state.books berubah
  useEffect(() => {
    setSavedBooks(state.books);
  }, [state.books, setSavedBooks]);
  
  // Actions
  const addBook = (book) => {
    dispatch({ type: ADD_BOOK, payload: book });
  };
  
  const editBook = (book) => {
    dispatch({ type: EDIT_BOOK, payload: book });
  };
  
  const deleteBook = (id) => {
    dispatch({ type: DELETE_BOOK, payload: id });
  };
  
  const setFilter = (filter) => {
    dispatch({ type: SET_FILTER, payload: filter });
  };
  
  const setSearchTerm = (term) => {
    dispatch({ type: SET_SEARCH, payload: term });
  };
  
  // Mendapatkan buku yang sudah difilter berdasarkan status dan kata kunci pencarian
  const getFilteredBooks = () => {
    return state.books.filter(book => {
      // Filter berdasarkan status
      const statusMatch = state.filter === 'semua' || book.status === state.filter;
      
      // Filter berdasarkan kata kunci pencarian
      const searchMatch = state.searchTerm === '' || 
        book.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(state.searchTerm.toLowerCase());
        
      return statusMatch && searchMatch;
    });
  };
  
  return (
    <BookContext.Provider value={{
      books: state.books,
      filter: state.filter,
      searchTerm: state.searchTerm,
      filteredBooks: getFilteredBooks(),
      addBook,
      editBook,
      deleteBook,
      setFilter,
      setSearchTerm
    }}>
      {children}
    </BookContext.Provider>
  );
};

BookProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook untuk menggunakan BookContext
export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext harus digunakan di dalam BookProvider');
  }
  return context;
};

export default BookContext;