import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          GameTracker
        </Link>

        <div className="navbar-links">
          <NavLink 
            to="/library" 
            className={({ isActive }) => 
              `navbar-link ${isActive ? 'active' : ''}`
            }
          >
            My Library
          </NavLink>
          <NavLink 
            to="/wishlist" 
            className={({ isActive }) => 
              `navbar-link ${isActive ? 'active' : ''}`
            }
          >
            Wishlist
          </NavLink>
          <NavLink 
            to="/search" 
            className={({ isActive }) => 
              `navbar-link ${isActive ? 'active' : ''}`
            }
          >
            Search Games
          </NavLink>
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-username">{user.username}</span>
              <button 
                onClick={logout} 
                className="navbar-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="navbar-link register"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;