import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LibraryContext } from '../../contexts/LibraryContext';
import { WishlistContext } from '../../contexts/WishlistContext';
import GameCard from '../../components/games/GameCard/GameCard';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { getTrendingGames } from '../../api/games';
import './Home.css';

export default function Home() {
  const { user } = useContext(AuthContext);
  const { library } = useContext(LibraryContext);
  const { wishlist } = useContext(WishlistContext);
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Calculate user stats if logged in
  const userStats = user ? {
    totalGames: library.length,
    playing: library.filter(game => game.status === 'playing').length,
    completed: library.filter(game => game.status === 'completed').length,
    wishlist: wishlist.length
  } : null;

  return (
    <div className="home-page">
      {/* Decorative elements */}
      <div className="floating-controller">🎮</div>
      <div className="floating-controller">🕹️</div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Track Your Gaming Journey</h1>
          <p className="hero-subtitle">
            Manage your game collection, track progress, and discover new games
          </p>
          {!user ? (
            <div className="hero-cta">
              <Link to="/register">
                <Button variant="primary" size="large">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="large">Login</Button>
              </Link>
            </div>
          ) : (
            <div className="hero-cta">
              <Link to="/library">
                <Button variant="primary" size="large">My Library</Button>
              </Link>
              <Link to="/search">
                <Button variant="secondary" size="large">Find Games</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* User Stats Section (if logged in) */}
      {user && userStats && (
        <section className="stats-section">
          <h2>Your Gaming Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{userStats.totalGames}</div>
              <div className="stat-label">Games in Library</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.playing}</div>
              <div className="stat-label">Currently Playing</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.wishlist}</div>
              <div className="stat-label">In Wishlist</div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Games Section */}
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
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
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
            <p>Share your thoughts and see what others think about games</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Discover Games</h3>
            <p>Find new games to play based on what's trending</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="cta-section">
          <h2>Ready to Start Tracking?</h2>
          <p>Join GameTracker today and never lose track of your gaming journey</p>
          <Link to="/register">
            <Button variant="primary" size="large">Create Account</Button>
          </Link>
        </section>
      )}
    </div>
  );
}