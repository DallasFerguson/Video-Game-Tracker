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
import Reviews from './pages/Reviews/Reviews';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

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