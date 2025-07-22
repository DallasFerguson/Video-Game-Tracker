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
@@ -25,6 +29,9 @@
      { path: 'search', element: <Search /> },
      { path: 'trending', element: <Trending /> },
      { path: 'games/:id/reviews', element: <Reviews /> },
      { path: 'library', element: <Library /> },
      { path: 'wishlist', element: <Wishlist /> },
      
      // 404
      { path: '*', element: <NotFound /> }
    ]
@@ -40,14 +47,16 @@
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
