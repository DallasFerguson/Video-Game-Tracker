// App.js or main router file
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
// File: frontend/src/App.js
// Make sure the import and routes are properly configured

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ReviewProvider } from './contexts/ReviewContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Library from './pages/Library/Library';
import Wishlist from './pages/Wishlist/Wishlist';
import GameDetail from './pages/Games/GameDetail/GameDetail';
// Remove import statements for Library, Wishlist, and Review components
import Search from './pages/Games/Search/Search';
import Trending from './pages/Games/Trending/Trending';
import Reviews from './pages/Reviews/Reviews'; 
import NotFound from './pages/NotFound/NotFound';
import './App.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'games/:id', element: <GameDetail /> },
      { path: 'search', element: <Search /> },
      { path: 'trending', element: <Trending /> },
      { path: 'games/:id/reviews', element: <Reviews /> },
      { path: 'library', element: <Library /> },
      { path: 'wishlist', element: <Wishlist /> },
      
      // 404
      { path: '*', element: <NotFound /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Search />} /> {/* Optional trending route */}
            <Route path="/game/:id" element={<GameDetail />} />
            {/* Remove Library, Wishlist, and Review routes */}
          </Routes>
        </main>
      </div>
    </Router>
    <ThemeProvider>
      <NotificationProvider>
        <LibraryProvider>
          <WishlistProvider>
            <ReviewProvider>
              <RouterProvider router={router} />
            </ReviewProvider>
          </WishlistProvider>
        </LibraryProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
