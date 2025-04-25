// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Hapus jest.mock sebelum import App
// Sebagai gantinya, buat mock komponen dari App

// Mock komponen dan dependensi dari App terlebih dahulu
jest.mock('./pages/Home/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Stats/Stats', () => () => <div>Stats Page</div>);
jest.mock('./context/BookContext', () => ({
  BookProvider: ({ children }) => <div>{children}</div>
}));
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => <div></div>,
  Link: ({ children }) => <a>{children}</a>
}));

// Import App setelah mocking dependensi
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  // Test sederhana untuk memastikan rendering berhasil
  const routerElement = screen.getByTestId("router");
  expect(routerElement).toBeInTheDocument();
});