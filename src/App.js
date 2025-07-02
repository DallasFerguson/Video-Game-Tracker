import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Library from './pages/Library/Library';
import Wishlist from './pages/Wishlist/Wishlist';
import GameDetail from './pages/Games/GameDetail/GameDetail';
import Search from './pages/Games/Search/Search';
import Trending from './pages/Games/Trending/Trending';
import Reviews from './pages/Reviews/Reviews';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestRoute from './components/routes/GuestRoute';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'games/:id', element: <GameDetail /> },
      { path: 'search', element: <Search /> },
      { path: 'trending', element: <Trending /> },
      { path: 'games/:id/reviews', element: <Reviews /> },
      
      // Auth routes (guest only)
      { 
        path: 'login', 
        element: <GuestRoute><Login /></GuestRoute> 
      },
      { 
        path: 'register', 
        element: <GuestRoute><Register /></GuestRoute> 
      },
      
      // Protected routes
      { 
        path: 'library', 
        element: <ProtectedRoute><Library /></ProtectedRoute> 
      },
      { 
        path: 'wishlist', 
        element: <ProtectedRoute><Wishlist /></ProtectedRoute> 
      },
      
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
        <AuthProvider>
          <LibraryProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
            </WishlistProvider>
          </LibraryProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;