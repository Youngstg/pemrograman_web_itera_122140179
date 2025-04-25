import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import './App.css';

function App() {
  return (
    <BookProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Manajemen Buku Pribadi</h1>
            <nav className="main-nav">
              <ul>
                <li>
                  <Link to="/">Daftar Buku</Link>
                </li>
                <li>
                  <Link to="/stats">Statistik</Link>
                </li>
              </ul>
            </nav>
          </header>
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>&copy; 2025 Aplikasi Manajemen Buku Pribadi</p>
          </footer>
        </div>
      </Router>
    </BookProvider>
  );
}

export default App;