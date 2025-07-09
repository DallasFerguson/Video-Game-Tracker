import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLibrary from '../../hooks/useLibrary';
import useWishlist from '../../hooks/useWishlist';
import GameCard from '../../components/games/GameCard/GameCard';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { getTrendingGames } from '../../api/games';
import './Home.css';

export default function Home() {
  const { library } = useLibrary();
  const { wishlist } = useWishlist();
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

  //calculate user stats
  const stats = {
    totalGames: library.length,
    playing: library.filter(game => game.status === 'playing').length,
    completed: library.filter(game => game.status === 'completed').length,
    wishlist: wishlist.length
  };

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
                <GameCard game={game} />
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