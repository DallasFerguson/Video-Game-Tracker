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
import Library from './pages/Library/Library';
import Wishlist from './pages/Wishlist/Wishlist';
import GameDetail from './pages/Games/GameDetail/GameDetail';
import Search from './pages/Games/Search/Search';
import Trending from './pages/Games/Trending/Trending';
import Reviews from './pages/Reviews/Reviews'; // Make sure this import is correct
import NotFound from './pages/NotFound/NotFound';
import './App.css';

// Double-check that the path to the Reviews component is correct
// If your file structure is different, adjust the import path accordingly

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // All routes now public
      { index: true, element: <Home /> },
      { path: 'games/:id', element: <GameDetail /> },
      { path: 'search', element: <Search /> },
      { path: 'trending', element: <Trending /> },
      { path: 'games/:id/reviews', element: <Reviews /> }, // Make sure this route is correct
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

export default App;