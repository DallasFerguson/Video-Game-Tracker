// src/pages/Home/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLibrary from '../../hooks/useLibrary';
import useWishlist from '../../hooks/useWishlist';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { getTrendingGames } from '../../api/games';
import './Home.css';

export default function Home() {
  // Add error handling for hooks
  const [libraryData, setLibraryData] = useState({ library: [] });
  const [wishlistData, setWishlistData] = useState({ wishlist: [] });
  const [hookError, setHookError] = useState(null);
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Try to use hooks safely
  useEffect(() => {
    try {
      const libraryHook = useLibrary();
      setLibraryData(libraryHook);
    } catch (error) {
      console.error('Error using LibraryContext:', error);
      setHookError(error.message);
      // Provide fallback data
      setLibraryData({ library: [] });
    }

    try {
      const wishlistHook = useWishlist();
      setWishlistData(wishlistHook);
    } catch (error) {
      console.error('Error using WishlistContext:', error);
      if (!hookError) setHookError(error.message);
      // Provide fallback data
      setWishlistData({ wishlist: [] });
    }
  }, []);

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        setLoading(true);
        const games = await getTrendingGames(4);
        setTrendingGames(games);
      } catch (error) {
        console.error('Failed to fetch trending games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  // Use data from state instead of directly from hooks
  const library = libraryData.library || [];
  const wishlist = wishlistData.wishlist || [];

  // Calculate user stats
  const stats = {
    totalGames: library.length,
    playing: library.filter(game => game.status === 'playing').length,
    completed: library.filter(game => game.status === 'completed').length,
    wishlist: wishlist.length
  };

  // If there's an error with the context hooks, show a minimal version
  if (hookError) {
    return (
      <div className="home-page" style={{ padding: '20px', backgroundColor: '#f8f8f8', color: '#333' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1>Game Tracker</h1>
          <p>Track your gaming journey</p>
          <p><strong>Note:</strong> Some features are currently unavailable.</p>
        </div>

        <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Trending Games</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {trendingGames.map(game => (
                <Link key={game.id} to={`/games/${game.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ height: '300px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                      {game.cover && game.cover.image_id ? (
                        <img 
                          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
                          alt={game.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          No Cover Available
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '15px' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>{game.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {game.first_release_date && (
                          <span>{new Date(game.first_release_date * 1000).getFullYear()}</span>
                        )}
                        {game.rating && (
                          <span>★ {Math.round(game.rating / 10)}/10</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Search for Games</h2>
          <p>Discover new games to add to your collection.</p>
          <Link to="/search">
            <Button variant="primary">Search Games</Button>
          </Link>
        </section>
      </div>
    );
  }

  // Regular rendering with context data
  return (
    <div className="home-page">
      {/*Decorative elements*/}
      <div className="floating-controller">🎮</div>
      <div className="floating-controller">🕹️</div>
      
      {/*Hero Section*/}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Track Your Gaming Journey</h1>
          <p className="hero-subtitle">
            Manage your game collection, track progress, and discover new games
          </p>
          <div className="hero-cta">
            <Link to="/library">
              <Button variant="primary" size="large">My Library</Button>
            </Link>
            <Link to="/search">
              <Button variant="secondary" size="large">Find Games</Button>
            </Link>
          </div>
        </div>
      </section>

      {/*User Stats Section*/}
      <section className="stats-section">
        <h2>Your Gaming Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalGames}</div>
            <div className="stat-label">Games in Library</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.playing}</div>
            <div className="stat-label">Currently Playing</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.wishlist}</div>
            <div className="stat-label">In Wishlist</div>
          </div>
        </div>
      </section>

      {/*Trending Games Section*/}
      <section className="trending-section">
        <div className="section-header">
          <h2>Trending Games</h2>
          <Link to="/trending" className="view-all-link">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="trending-loading">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="games-grid">
            {trendingGames.map(game => (
              <Link key={game.id} to={`/games/${game.id}`}>
                <div className="game-card">
                  <div className="game-card-cover">
                    {game.cover && game.cover.image_id ? (
                      <img 
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
                        alt={game.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="game-card-no-image">No Cover Available</div>
                    )}
                  </div>
                  <div className="game-card-info">
                    <h3 className="game-card-title">{game.name}</h3>
                    <div className="game-card-meta">
                      {game.first_release_date && (
                        <span className="game-card-year">
                          {new Date(game.first_release_date * 1000).getFullYear()}
                        </span>
                      )}
                      {game.rating && (
                        <span className="game-card-rating">
                          ★ {Math.round(game.rating / 10)}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/*Features Section*/}
      <section className="features-section">
        <h2>Track Your Games Like Never Before</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Organize Your Library</h3>
            <p>Keep track of all your games across different platforms in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Track Progress</h3>
            <p>Mark games as playing, completed, dropped, or plan to play</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate & Review</h3>
            <p>Record your thoughts and ratings about the games you play</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Discover Games</h3>
            <p>Find new games to play based on what's trending</p>
          </div>
        </div>
      </section>
    </div>
  );
}
