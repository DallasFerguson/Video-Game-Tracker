import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
          <NavLink 
            to="/trending" 
            className={({ isActive }) => 
              `navbar-link ${isActive ? 'active' : ''}`
            }
          >
            Trending
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;